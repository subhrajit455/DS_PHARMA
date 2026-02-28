import Party from "./party.model.js";
import ApiError from "../../utils/apiError.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../helpers/token.js";
import { generateUserId } from "../../helpers/generateUserId.js";
import { sendRegistraionMail } from "../../helpers/sendMails.js";

export const getPartiesService = async (page, limit, query = "") => {
  try {
    const parties = await Party.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
        { GSTIN: { $regex: query, $options: "i" } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalParties = await Party.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
        { GSTIN: { $regex: query, $options: "i" } },
      ],
    });
    const totalPages = Math.ceil(totalParties / limit);

    return { parties, totalPages, totalParties };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchPartiesService = async (
  page,
  limit,
  query = "",
  sortBy = "rid",
  is_deleted = "",
  order = 1,
) => {
  try {
    const searchFilter = query
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { code: { $regex: query, $options: "i" } },
            { MargCode: { $regex: query, $options: "i" } },
            { GSTIN: { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const parties = await Party.find({
      Is_Deleted: is_deleted,
      ...searchFilter,
    })
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalParties = await Party.countDocuments({
      Is_Deleted: is_deleted,
      ...searchFilter,
    });

    const totalActiveParties = await Party.countDocuments({
      Is_Deleted: "0",
      ...searchFilter,
    });

    const totalDeletedParties = await Party.countDocuments({
      Is_Deleted: "1",
      ...searchFilter,
    });

    const totalBalance = await Party.aggregate([
      {
        $match: {
          Is_Deleted: is_deleted,
          ...searchFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: { $toDouble: "$balance" } },
        },
      },
    ]);

    const totalPDC = await Party.aggregate([
      {
        $match: {
          Is_Deleted: is_deleted,
          ...searchFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalPDC: { $sum: { $toDouble: "$pdc" } },
        },
      },
    ]);

    const totalPages = Math.ceil(totalParties / limit);

    return {
      parties,
      totalPages,
      totalParties,
      totalActiveParties,
      totalDeletedParties,
      totalBalance: totalBalance[0]?.totalBalance || 0,
      totalPDC: totalPDC[0]?.totalPDC || 0,
    };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const getPartyDetailsService = async (rid) => {
  try {
    const party = await Party.findOne({ rid });
    return party;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const getAllPartiesService = async () => {
  try {
    const parties = await Party.find();
    return parties;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

// Register a party:
// - If a matching party is found (by phone1 or MargCode) → attach credentials to it
// - If NOT found → create a new party document with the provided details
export const partyRegisterService = async ({
  name,
  phone1,
  email1,
  address,
  MargCode,
  GSTIN,
  DlNo,
  password,
}) => {
  try {
    if (!password || !name) {
      throw new ApiError(400, "name and password are required");
    }

    const userId = generateUserId();

    // Try to find an existing party by phone1 or DlNo
    const searchFilter = [];
    if (phone1) searchFilter.push({ phone1 });
    if (DlNo) searchFilter.push({ DlNo });

    const existingParty =
      searchFilter.length > 0
        ? await Party.findOne({ $or: searchFilter })
        : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    let party;

    if (existingParty) {
      // Party already exists in Marg — just attach credentials
      // if (existingParty.userId) {
      //   throw new ApiError(
      //     400,
      //     'This party already has an account. Please login.',
      //   );
      // }

      existingParty.userId = userId;
      existingParty.password = hashedPassword;
      existingParty.isVerified = false;

      await existingParty.save();
      party = existingParty;
    } else {
      // New party — create a fresh document (rid will be null until Marg sync)
      party = await Party.create({
        name,
        phone1,
        email1,
        address,
        MargCode,
        GSTIN,
        DlNo,
        userId,
        password: hashedPassword,
        isVerified: false,
      });
    }

    await sendRegistraionMail(party);

    const partyData = party.toObject();
    delete partyData.password;

    return partyData;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message);
  }
};

// Login a party using userId + password
export const partyLoginService = async ({ userId, password }) => {
  try {
    if (!userId || !password) {
      throw new ApiError(400, "userId and password are required");
    }

    const party = await Party.findOne({ userId });

    if (!party || !party.password) {
      throw new ApiError(400, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, party.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    // if (!party.isVerified) {
    //   throw new ApiError(
    //     403,
    //     "Account not verified. Please contact the distributor.",
    //   );
    // }

    const token = generateToken({
      id: party._id,
      userId: party.userId,
      role: "party",
      rid: party.rid ? party.rid : null,
    });

    const partyData = party.toObject();
    delete partyData.password;

    return { party: partyData, token };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message);
  }
};

// Update party's own profile details (local only — does NOT sync back to Marg)
// Marg-controlled fields (rid, balance, pdc, opening, Is_Deleted) cannot be updated here
export const updatePartyService = async (partyId, updates) => {
  try {
    const allowedFields = [
      "name",
      "address",
      "phone1",
      "phone2",
      "phone3",
      "phone4",
      "email1",
      "email2",
      "email3",
      "bank",
      "branch",
      "MargCode",
      "GSTIN",
      "DlNo",
      "area",
      "code",
      "gcode",
      "LedgerCode",
      "isVerified",
    ];

    // Only pick allowed fields from the update payload
    const safeUpdates = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        safeUpdates[field] = updates[field];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      throw new ApiError(400, "No valid fields provided to update");
    }

    const party = await Party.findByIdAndUpdate(
      partyId,
      { $set: safeUpdates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!party) {
      throw new ApiError(404, "Party not found");
    }

    return party;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message);
  }
};

export const getPartyByUserIdService = async (userId) => {
  try {
    const party = await Party.findOne({ userId });
    return party;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

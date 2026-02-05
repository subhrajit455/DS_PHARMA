import Party from "./party.model.js";
import ApiError from "../../utils/apiError.js";

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

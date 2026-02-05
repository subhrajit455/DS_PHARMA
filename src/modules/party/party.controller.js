import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  fetchPartiesService,
  getPartiesService,
  getPartyDetailsService,
} from "./party.service.js";

export const getParties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "" } = req.query;
  const { parties, totalPages, totalParties } = await getPartiesService(
    page,
    limit,
    query.trim().toLowerCase(),
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        parties,
        totalParties,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Parties fetched successfully",
    ),
  );
});

export const fetchParties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "name",
    is_deleted = "0",
    order = 1,
  } = req.query;

  const {
    parties,
    totalPages,
    totalParties,
    totalActiveParties,
    totalDeletedParties,
    totalBalance,
    totalPDC,
  } = await fetchPartiesService(
    Number(page),
    Number(limit),
    query.trim().toLowerCase(),
    sortBy,
    is_deleted,
    Number(order),
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        parties,
        totalParties,
        totalActiveParties,
        totalDeletedParties,
        totalBalance,
        totalPDC,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Parties fetched successfully",
    ),
  );
});

export const getPartyDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;

  const party = await getPartyDetailsService(rid);

  res
    .status(200)
    .json(new ApiResponse(200, party, "Party details fetched successfully"));
});

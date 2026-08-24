import React, { useEffect, useState } from "react";
import apiClient from "@/services/api/apiClient";

const REQUEST_STATUS_OPTIONS = ["requested", "accepted", "rejected", "closed"];

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [meta, setMeta] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/api/v1/products/request");
      const payload = response?.data;
      console.log("Raw API response for requests:", payload);
      const extractedRequests =
        payload?.data?.requests ||
        payload?.requests ||
        payload?.data ||
        payload ||
        [];

      const metaInfo = payload?.data || payload || {};

      if (typeof metaInfo === "object" && !Array.isArray(metaInfo)) {
        const { totalRequests, page, totalPages, limit, hasMore } = metaInfo;
        setMeta({ totalRequests, page, totalPages, limit, hasMore });
      } else {
        setMeta({});
      }

      setRequests(Array.isArray(extractedRequests) ? extractedRequests : []);
    } catch (err) {
      setError(err?.message || "Unable to load requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await apiClient.patch(
        `/api/v1/products/request/${requestId}`,
        { status: newStatus },
      );

      const updatedRequest = response?.data?.data || response?.data || null;
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request?._id === requestId || request?.id === requestId
            ? { ...request, status: updatedRequest?.status || newStatus }
            : request,
        ),
      );
    } catch (err) {
      console.error("Failed to update request status:", err);
      setError(err?.message || "Unable to update request status.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stock Requests</h1>
          {meta?.totalRequests != null && (
            <p className="text-sm text-gray-600">
              Showing {requests.length} of {meta.totalRequests} request(s) ·
              Page {meta.page || meta.currentPage || 1} of{" "}
              {meta.totalPages || 1}
            </p>
          )}
        </div>
        <button
          onClick={loadRequests}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          style={{
            padding: "10px",
          }}
        >
          Refresh
        </button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading requests...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : !requests?.length ? (
          <div className="text-sm text-gray-500">No request records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {requests.map((request) => (
                  <tr
                    key={request?._id || request?.id || JSON.stringify(request)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {request?.requestedByUser?.rid || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {request?.product?.name ||
                        request?.product?.rid ||
                        request?.productId ||
                        "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {request?.requestedByUser?.name ||
                        request?.requestedBy ||
                        "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {request?.quantity ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      <select
                        value={request?.status || "requested"}
                        onChange={(e) =>
                          handleStatusChange(
                            request?._id || request?.id,
                            e.target.value,
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        {REQUEST_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {request?.createdAt
                        ? new Date(request.createdAt).toLocaleString()
                        : request?.created_at
                          ? new Date(request.created_at).toLocaleString()
                          : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;

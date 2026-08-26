import React, { useEffect, useState } from "react";
import apiClient from "@/services/api/apiClient";

const REQUEST_STATUS_OPTIONS = [
  "requested",
  "accepted",
  "rejected",
  "closed",
];

/* =====================================================
   ICONS
===================================================== */

const Icons = {
  request: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6M9 16h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
      />
    </svg>
  ),

  refresh: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h5M20 20v-5h-5M5.4 9A7.5 7.5 0 0118.8 6.2M18.6 15A7.5 7.5 0 015.2 17.8"
      />
    </svg>
  ),

  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3M16 7V3M4 10h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
      />
    </svg>
  ),

  alert: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),

  empty: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-7 w-7"
    >
      <path
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5h6M9 9h6M9 13h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
      />
    </svg>
  ),
};

/* =====================================================
   STATUS CONFIG
===================================================== */

const STATUS_CONFIG = {
  accepted: {
    label: "Accepted",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",

  },

  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",

  },

  closed: {
    label: "Closed",
    bg: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-700",

  },

  requested: {
    label: "Requested",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",

  },
};

/* =====================================================
   STAT CARD
===================================================== */

const StatCard = ({ title, value, subtitle, icon, iconClass }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md card-improved animate-pop">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-50 opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex items-center justify-between gap-1">
        <div className="min-w-0">
          <p className="ml-10 text-xs font-medium text-slate-500">{title}</p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   STATUS SELECT
===================================================== */

const StatusSelect = ({ status, requestId, onChange }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.requested;

  return (
    <div className="relative w-full max-w-[130px]">
      <span
        className={`pointer-events-none absolute left-3 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full ${config.dot}`}
      />

      <select
        value={status}
        onChange={(e) => onChange(requestId, e.target.value)}
        className={`w-full cursor-pointer appearance-none rounded-full border py-2 pl-7 pr-7 text-xs font-bold capitalize outline-none transition-all focus:ring-2 focus:ring-indigo-200 ${config.bg} ${config.border} ${config.text}`}
      >
        {REQUEST_STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9l6 6 6-6"
        />
      </svg>
    </div>
  );
};

/* =====================================================
   REQUEST LIST
===================================================== */

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [meta, setMeta] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===================================================
     LOAD REQUESTS
  =================================================== */

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(
        "/api/v1/products/request",
      );

      const payload = response?.data;

      console.log(
        "Raw API response for requests:",
        payload,
      );

      const extractedRequests =
        payload?.data?.requests ||
        payload?.requests ||
        payload?.data ||
        payload ||
        [];

      const metaInfo =
        payload?.data || payload || {};

      if (
        typeof metaInfo === "object" &&
        !Array.isArray(metaInfo)
      ) {
        const {
          totalRequests,
          page,
          totalPages,
          limit,
          hasMore,
        } = metaInfo;

        setMeta({
          totalRequests,
          page,
          totalPages,
          limit,
          hasMore,
        });
      } else {
        setMeta({});
      }

      setRequests(
        Array.isArray(extractedRequests)
          ? extractedRequests
          : [],
      );
    } catch (err) {
      setError(
        err?.message ||
        "Unable to load requests.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    loadRequests();
  }, []);

  /* ===================================================
     STATUS UPDATE
  =================================================== */

  const handleStatusChange = async (
    requestId,
    newStatus,
  ) => {
    try {
      const response = await apiClient.patch(
        `/api/v1/products/request/${requestId}`,
        {
          status: newStatus,
        },
      );

      const updatedRequest =
        response?.data?.data ||
        response?.data ||
        null;

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request?._id === requestId ||
            request?.id === requestId
            ? {
              ...request,
              status:
                updatedRequest?.status ||
                newStatus,
            }
            : request,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to update request status:",
        err,
      );

      setError(
        err?.message ||
        "Unable to update request status.",
      );
    }
  };

  /* ===================================================
     HELPERS
  =================================================== */

  const getProductName = (request) =>
    request?.product?.name ||
    request?.product?.rid ||
    request?.productId ||
    "Unknown Product";

  const getRequester = (request) =>
    request?.requestedByUser?.name ||
    request?.requestedBy ||
    "Unknown User";

  const getRequesterRid = (request) =>
    request?.requestedByUser?.rid || "—";

  const getInitial = (name) =>
    name?.charAt(0)?.toUpperCase() || "?";

  const formatDate = (request) => {
    const value =
      request?.createdAt ||
      request?.created_at;

    if (!value) {
      return {
        date: "—",
        time: "",
      };
    }

    const parsedDate = new Date(value);

    return {
      date: parsedDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      ),

      time: parsedDate.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
    };
  };

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="min-h-screen bg-[#f5f7fb] ">
        <div className="container-max w-full px-4 py-6 sm:px-6 lg:px-7">

          {/* ============================================
            HEADER
        ============================================ */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0096FF] text-white shadow-lg shadow-indigo-200">
                  {Icons.request}
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    Stock Requests
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Manage and track product stock requests
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={loadRequests}
              disabled={isLoading}
              className="inline-flex h-10 w-24 items-center justify-center gap-2 rounded-xl bg-[#0096FF] px-4 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:bg-[#0096FF] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 soft-transition"
            >
              <span
                className={
                  isLoading ? "animate-spin" : ""
                }
              >
                {Icons.refresh}
              </span>

              Refresh
            </button>
          </div>

          {/* ============================================
            STAT CARDS
        ============================================ */}

          <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

            <StatCard
              title="Total Requests"
              value={
                meta?.totalRequests ??
                requests.length
              }
              subtitle="All requests"
              icon={Icons.request}
              iconClass="bg-indigo-50 text-indigo-600"
            />

            <StatCard
              title="Current Page"
              value={meta?.page || 1}
              subtitle="Active page"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Total Pages"
              value={meta?.totalPages || 1}
              subtitle="Available pages"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 6h14M5 12h14M5 18h14"
                  />
                </svg>
              }
              iconClass="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Showing"
              value={requests.length}
              subtitle="Current records"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6M9 16h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
              }
              iconClass="bg-amber-50 text-amber-600"
            />
          </div>

          {/* ============================================
            REQUEST TABLE
        ============================================ */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm card-improved animate-fade-in">

            {/* TABLE TITLE */}

            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Request Records
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  {requests.length} request
                  {requests.length !== 1
                    ? "s"
                    : ""}{" "}
                  displayed
                </p>
              </div>

              {meta?.totalPages && (
                <div className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  Page {meta?.page || 1} /{" "}
                  {meta?.totalPages || 1}
                </div>
              )}
            </div>

            {/* ==========================================
              LOADING
          ========================================== */}

            {isLoading ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Loading requests...
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Fetching the latest records
                </p>
              </div>
            ) : error ? (

              /* ========================================
                 ERROR
              ======================================== */

              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  {Icons.alert}
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Something went wrong
                </h3>

                <p className="mt-1 max-w-md text-sm text-red-500">
                  {error}
                </p>

                <button
                  onClick={loadRequests}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Try Again
                </button>
              </div>

            ) : !requests.length ? (

              /* ========================================
                 EMPTY
              ======================================== */

              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                  {Icons.empty}
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  No requests found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  No stock requests are available right now.
                </p>
              </div>

            ) : (

              /* ========================================
                 DATA
              ======================================== */

              <>
                {/* DESKTOP TABLE */}

                <div className="hidden w-full lg:block overflow-hidden">
                  <div className="w-full min-w-0">

                    {/* HEADER */}

                    <div className="grid grid-cols-[1fr_1.5fr_1.2fr_.5fr_1fr_1.2fr] items-center gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-3">

                      {[
                        "Request ID",
                        "Product",
                        "Requested By",
                        "Qty",
                        "Status",
                        "Created At",
                      ].map((title, index) => (
                        <div
                          key={title}
                          className={`text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 ${index === 3
                            ? "text-center"
                            : ""
                            }`}
                        >
                          {title}
                        </div>
                      ))}
                    </div>

                    {/* ROWS */}

                    <div className="divide-y divide-slate-100">

                      {requests.map((request) => {
                        const requestId =
                          request?._id ||
                          request?.id ||
                          "unknown";

                        const status =
                          request?.status ||
                          "requested";

                        const productName =
                          getProductName(request);

                        const requester =
                          getRequester(request);

                        const requesterRid =
                          getRequesterRid(request);

                        const date =
                          formatDate(request);

                        return (
                          <div
                            key={requestId}
                            className="grid grid-cols-[1.1fr_1.7fr_1.4fr_.55fr_1fr_1.35fr] items-center gap-4 px-5 py-4 transition-colors hover:bg-indigo-50/30"
                          >

                            {/* REQUEST ID */}

                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                {Icons.request}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="truncate text-sm font-bold text-slate-800"
                                  title={requesterRid}
                                >
                                  {requesterRid}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                  Request ID
                                </p>
                              </div>
                            </div>

                            {/* PRODUCT */}

                            <div className="min-w-0">
                              <p
                                className="truncate text-sm font-semibold text-slate-800"
                                title={productName}
                              >
                                {productName}
                              </p>

                              {request?.product?.rid && (
                                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                                  SKU ·{" "}
                                  {request.product.rid}
                                </p>
                              )}
                            </div>

                            {/* REQUESTER */}

                            <div className="flex min-w-0 items-center gap-2.5">

                              <div className="min-w-0">
                                <p
                                  className="truncate text-sm font-semibold text-slate-800"
                                  title={requester}
                                >
                                  {requester}
                                </p>

                                <p className="text-[10px] text-slate-500">
                                  Requester
                                </p>
                              </div>
                            </div>

                            {/* QUANTITY */}

                            <div className="flex justify-center">
                              <span className="inline-flex min-w-[42px] items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-bold text-slate-700">
                                {request?.quantity ??
                                  "—"}
                              </span>
                            </div>

                            {/* STATUS */}

                            <StatusSelect
                              status={status}
                              requestId={requestId}
                              onChange={
                                handleStatusChange
                              }
                            />

                            {/* CREATED */}

                            <div className="flex min-w-0 items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                {Icons.calendar}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-slate-600">
                                  {date.date}
                                </p>

                                <p className="text-[10px] text-slate-500">
                                  {date.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ========================================
                  MOBILE / TABLET
              ======================================== */}

                <div className="divide-y divide-slate-100 lg:hidden">

                  {requests.map((request) => {
                    const requestId =
                      request?._id ||
                      request?.id ||
                      "unknown";

                    const status =
                      request?.status ||
                      "requested";

                    const productName =
                      getProductName(request);

                    const requester =
                      getRequester(request);

                    const requesterRid =
                      getRequesterRid(request);

                    const date =
                      formatDate(request);

                    return (
                      <div
                        key={requestId}
                        className="p-4 transition hover:bg-indigo-50/20 sm:p-5"
                      >

                        {/* TOP */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                              {Icons.request}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-800">
                                {requesterRid}
                              </p>

                              <p
                                className="truncate text-xs text-slate-500"
                                title={productName}
                              >
                                {productName}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <StatusSelect
                              status={status}
                              requestId={requestId}
                              onChange={
                                handleStatusChange
                              }
                            />
                          </div>
                        </div>

                        {/* DETAILS */}

                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              Requested By
                            </p>

                            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                              {requester}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              Quantity
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              {request?.quantity ??
                                "—"}{" "}
                              units
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              Created At
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-700">
                              {date.date}
                            </p>

                            <p className="text-[10px] text-slate-500">
                              {date.time}
                            </p>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* FOOTER */}

                <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-600">
                      {requests.length}
                    </span>{" "}
                    request
                    {requests.length !== 1
                      ? "s"
                      : ""}
                  </p>

                  <p className="text-slate-500">
                    Page{" "}
                    <span className="font-semibold text-slate-600">
                      {meta?.page || 1}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-600">
                      {meta?.totalPages || 1}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestList;
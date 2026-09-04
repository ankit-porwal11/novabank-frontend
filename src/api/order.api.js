import axiosClient from "./axiosClient.js";

/**
 * Order module API. Per this task's explicit scope, backend.zip and the
 * Postman collection were NOT re-analyzed for this module — these calls
 * follow the endpoint list and request bodies given directly in the task
 * spec, treated as the source of truth.
 *
 * One inconsistency in the spec itself, flagged rather than silently
 * resolved: the "APIs Allowed For This Task" header lists 7 endpoints and
 * does not include an accept-order endpoint, but the "Track Now Page
 * Actions" section later requires one ("Button API: GET
 * /order/accept-order/:orderId") for the mandatory Accept Order corner
 * case. Since Accept Order is explicitly mandatory and no alternative
 * endpoint is given, this file implements it exactly as specified in that
 * section. If this endpoint doesn't actually exist, only acceptOrder()
 * below needs to change.
 */

// order history 
export async function getOrderHistory() {
  const response = await axiosClient.get("/order/history");
  return response.data.data;
}

// POST /address/add
export async function addAddress({ fullName, mobileNumber, addressLine1, city, state, pincode }) {
  const response = await axiosClient.post("/address/add", {
    fullName,
    mobileNumber,
    addressLine1,
    city,
    state,
    pincode,
  });
  return response.data.data;
}

// GET /address/my-addresses
export async function getMyAddresses() {
  const response = await axiosClient.get("/address/my-addresses");
  return response.data.data;
}

// POST /order/create
export async function createOrder({ itemType, addressId }) {
  const response = await axiosClient.post("/order/create", { itemType, addressId });
  return response.data.data;
}

// GET /order/current
// Treated as the single source for both the Overview summary/active list
// and the History tab's full lifecycle view (no separate "all orders" or
// "order history" endpoint is in the allowed list), so it's read as
// returning every order belonging to the user, not only in-flight ones.
export async function getCurrentOrders() {
  const response = await axiosClient.get("/order/current");
  return response.data.data;
}

// GET /order/details/:orderId
export async function getOrderDetails(orderId) {
  const response = await axiosClient.get(`/order/details/${orderId}`);
  return response.data.data;
}

// GET /order/track/:trackingNumber
export async function trackOrderByNumber(trackingNumber) {
  const response = await axiosClient.get(`/order/track/${trackingNumber}`);
  return response.data.data;
}

// POST /order/redispatch/:orderId
export async function redispatchOrder(orderId) {
  const response = await axiosClient.post(`/order/redispatch/${orderId}`);
  return response.data.data;
}

// GET /order/accept-order/:orderId — see file-level note above.
export async function acceptOrder(orderId) {
  const response = await axiosClient.get(`/order/accept-order/${orderId}`);
  return response.data.data;
}

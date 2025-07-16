import api from "../api/axiosClient";



export async function subscribeToService(streamData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)


  const response = await api().post("api/subscribe", streamData);
  return response.data;
}


export async function getsubscribeByUser(page) {
  const response = await api().get(`api/subscribe?page=${page || 1}`);
  return response.data;
}
export async function getsubscribeByAdmin(page) {
  const response = await api().get(`api/admin/subscribe?page=${page || 1}`);
  return response.data;
}

export async function changeStatus(id, paylod) {
  const response = await api().post(`api/admin/subscribe/${id}`, paylod);
  return response.data;
}



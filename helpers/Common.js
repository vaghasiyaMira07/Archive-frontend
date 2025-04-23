import moment from "moment";

export function formatDate(ci) {
  return moment(ci.value)
    .local()
    .format("DD MMM YYYY");
}

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

export const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

export const getDate = (date) => {
  let d = new Date(date)
  if (d.getDate() < 10 && d.getMonth() < 10) {
    return d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + d.getDate()
  } else {
    if (d.getDate() < 10) {
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-0" + d.getDate()
    } else if (d.getMonth() < 10) {
      return d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + d.getDate()
    }
  }
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
  // return "2020-11-11"
}

export const getBase64 = async (file) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
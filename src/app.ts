import axios from "axios";

// ここにコードを書きます


// api key
const APIKEY = process.env.GOOGLE_API_KEY;

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

const address = (event: Event) => {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${APIKEY}`
    )
    .then((res) => {
      if (res.data.status !== "OK") {
        throw new Error("座標を取得できませんでした。");
      }
      const coordinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 16
      });
      new google.maps.Marker({position:coordinates, map:map})
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
};

form.addEventListener("submit", address);

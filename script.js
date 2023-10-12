const ALL_BREADS_URL = "https://dog.ceo/api/breeds/list/all";
const RANDOM_IMAGE_URL = "https://dog.ceo/api/breeds/image/random";

const breadsListUl = document.getElementById("breads-list");
const carouselImage = document.getElementById("carousel-image");
const content = document.getElementById("content");

const imageUrls = [];
let currentImage = 0;

function startCarousel() {
  setInterval(() => {
    carouselImage.src = imageUrls[currentImage === 2 ? 0 : currentImage + 1];
    currentImage = currentImage === 2 ? 0 : currentImage + 1;
  }, 1000);
}

function getRandomImage() {
  fetch(RANDOM_IMAGE_URL)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      imageUrls.push(data.message);
      if (imageUrls.length === 3) {
        startCarousel();
      }
    });
}

function getRandomImages() {
  const fetchPromises = [];
  for (let i = 0; i < 3; i++) {
    fetchPromises.push(fetch(RANDOM_IMAGE_URL));
  }
  Promise.all(fetchPromises)
    .then(function (responses) {
      const responsePromises = [];
      responses.forEach((response) => responsePromises.push(response.json()));
      return Promise.all(responsePromises);
    })
    .then((allData) => {
      imageUrls.push(...allData.map((d) => d.message));
      startCarousel();
    });
}

function drawSelectedBreadImages(images) {
  content.innerHTML = "";
  images.forEach((image) => {
    const img = document.createElement("img");
    img.src = image;
    content.append(img);
  });
}

function onBreadNameClick(bread) {
  fetch(`https://dog.ceo/api/breed/${bread}/images`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      drawSelectedBreadImages(data.message.slice(0, 10));
    });
}

function drawBreads(breads) {
  Object.keys(breads).forEach((bread) => {
    const li = document.createElement("li");
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("bread-name");
    nameDiv.append(bread);
    nameDiv.addEventListener("click", () => {
      onBreadNameClick(bread);
    });
    li.append(nameDiv);
    if (breads[bread].length) {
      const subBreedUl = document.createElement("ul");
      breads[bread].forEach((subBread) => {
        const subBreadLi = document.createElement("li");
        subBreadLi.append(subBread);
        subBreedUl.append(subBreadLi);
      });
      li.append(subBreedUl);
    }
    breadsListUl.append(li);
  });
}

function getAllBreads() {
  fetch(ALL_BREADS_URL).then(
    (response) => {
      response.json().then(
        (data) => {
          drawBreads(data.message);
        },
        () => {}
      );
    },
    () => {}
  );
}

getAllBreads();
getRandomImages();

const categoriesContainer = document.getElementById("categories");
const allVideosBtn = document.getElementById("all-videos");
const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search");
const allCategoryBtn = [];
const createCategories = async () => {
  // get datas from api
  try {
    const data = await fetch(
      "https://openapi.programming-hero.com/api/phero-tube/categories"
    );
    const response = await data.json();
    const categoryList = response.categories;
    categoryList.forEach((element) => {
      const btnCategory = document.createElement("button");
      btnCategory.classList =
        "btn px-3 md:px-5 py-1 md:py-[10px] rounded-md hover:text-white hover:bg-[#FF1F3D] text-sm md:text-base font-semibold hover:text-white";
      btnCategory.innerText = element.category;
      btnCategory.id = `btn${element.category}`;
      allCategoryBtn.push(`btn${element.category}`);
      btnCategory.addEventListener("click", (event) => {
        changeCategory(element.category_id);
        changeBtnColor(`btn${element.category}`);
      });
      categoriesContainer.appendChild(btnCategory);
    });
  } catch (e) {
    alert("something went wrong");
  }
};

const createVideo = (video) => {
  const videoConatiner = document.getElementById("all-video-container");
  videoConatiner.innerHTML = "";
  if (video.length !== 0) {
    videoConatiner.classList.add("grid");
    video.forEach((element) => {
      // check verified
      let badge = "hidden";
      if (element.authors[0].verified === true) {
        badge = "block";
      }
      // show video
      const div = document.createElement("div");
      div.innerHTML = `<div class ="lg:hover:transform lg:hover:scale-105 transition-all duration-200 cursor-pointer">
            <!-- thumbnail -->
            <div class = "relative">
              <img
                class="rounded-xl aspect-video bg-cover w-full"
                src= ${element.thumbnail}
                alt="video thumbnail"
              />
              ${
                element.others.posted_date !== ""
                  ? `<span class = 'bg-gray-800 text-white text-sm rounded px-2 absolute right-2 bottom-2'> ${convertTime(
                      element.others.posted_date
                    )} </span>`
                  : ""
              }
              
            </div>
            <!-- title and pp container -->
            <div class="grid grid-cols-6 mt-[20px]">
              <!-- author img -->
              <div class="col-span-1">
                <img
                  class="rounded-full h-10 w-10"
                  src= ${element.authors[0].profile_picture}
                  alt="author profile picture"
                />
              </div>
              <!-- video details -->
              <div class="col-span-5 space-y-[1px] text-[rgba(23, 23, 23, 0.7)]">
                <h1 class="text-lg font-bold line-clamp-2">
                  ${element.title}
                </h1>
                <div id = 'author' class="flex items-center gap-1">
                  <p class="text-sm font-normal">${
                    element.authors[0].profile_name
                  }</p>
                  
                  <i id = 'badge' class="fa-solid ${badge} fa-badge-check text-blue-500 text-sm"></i>
                </div>
                <p class="text-sm"> ${element.others.views} views</p>
              </div>
            </div>
          </div>`;
      videoConatiner.appendChild(div);
    });
  } else {
    videoConatiner.classList.remove("grid");
    videoConatiner.innerHTML = `<div class="flex flex-col items-center justify-center mt-4 space-y-4">
          <img src="assets/Icon.png" alt="no videos found icon" />
          <p class = "text-2xl font-semibold">Opps! Sorry! There is no content found.</p>
        </div>`;
  }
};
const fetchData = async (url, isCategory) => {
  let BASE_URL = url;
  // load the videos fron database

  const loadVideos = await fetch(BASE_URL);
  const response = await loadVideos.json();
  let video;
  if (isCategory) {
    video = response.category;
  } else {
    video = response.videos;
  }
  createVideo(video);
};

const showAllVideos = async () => {
  try {
    const BASE_URL =
      " https://openapi.programming-hero.com/api/phero-tube/videos";
    // add videos dynamically to the list
    fetchData(BASE_URL, false);
  } catch (e) {
    console.error("Error happend:", e);
  }
};

// show date on the thumbnail
const convertTime = (secs) => {
  if (secs !== "") {
    const secIny = 31536000;
    const secInday = 86400;
    const secInHour = 3600;
    const secInMin = 60;
    // get year
    const y = Math.floor(secs / secIny);
    secs %= secIny;
    // get day
    const days = Math.floor(secs / secInday);
    secs %= secInday;
    //   get hour
    const hour = Math.floor(secs / secInHour);
    secs %= secInHour;
    //   get min
    const min = Math.floor(secs / secInMin);
    secs %= secInMin;

    if (y === 0 && days === 0) {
      return `${hour}h ${min}min ${secs}sec ago`;
    } else if (hour === 0 && min === 0) {
      return `${secs}sec ago`;
    } else if (hour === 0) {
      return `${min}min ${secs}sec ago`;
    } else if (min === 0) {
      return `${secs}sec ago`;
    } else if (days == 0) {
      return `${hour}h ${min}min ${secs}sec ago`;
    } else if (y === 0 && days === 0 && min === 0) {
      return "";
    } else {
      return `${y}y ${days}d ${hour}h ${min}min ${secs}sec ago`;
    }
  } else {
    return "";
  }
};

// change category of videos3
const changeCategory = (id) => {
  const BASE_URL = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  fetchData(BASE_URL, true);
};

const changeBtnColor = (btn) => {
  console.log(btn);
  allCategoryBtn.push("all-videos");
  allCategoryBtn.forEach((element) => {
    if (element === btn) {
      document
        .getElementById(element)
        .classList.add("bg-[#FF1F3D]", "text-white");
    } else {
      document
        .getElementById(element)
        .classList.remove("bg-[#FF1F3D]", "text-white");
    }
  });
};
allVideosBtn.addEventListener("click", (e) => {
  showAllVideos();
  changeBtnColor(e.target.id);
});

searchInput.addEventListener("keyup", () => {
  if (searchInput.value === "") {
    showAllVideos();
  } else {
    searchNow();
  }
});

searchIcon.addEventListener("click", () => {
  searchNow();
});

// search videos
const searchNow = () => {
  const BASE_URL = `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchInput.value}`;
  fetchData(BASE_URL, false);
};

createCategories();
showAllVideos();

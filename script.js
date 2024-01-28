const commentContainer = document.querySelector("main");
const submit = document.querySelector(".submit");
let userImg = "";
let userName = "";

let likes = {};

const getComment = async function () {
  const res = await fetch("./data.json");
  const data = await res.json();

  userName = data.currentUser.username;
  userImg = data.currentUser.image.png;

  let html = "";

  for (const c of data.comments) {
    html = `<div class="comment" data-id="${c.id}">
    <div class="like">
      <img class="plus" src="images/icon-plus.svg" alt="" />
      <p>${c.score}</p>
      <img class="minus" src="images/icon-minus.svg" alt="" />
    </div>
    <div class="main-comment">
      <div class="user-detail">
        <img
          class="profile-picture"
          src="${c.user.image.png}"
          alt=""
        />
        <p class="username">${c.user.username}</p>
        <p>${c.createdAt}</p>
        <div class="reply">
          <img src="images/icon-reply.svg" alt="" />
          <span>Reply</span>
        </div>
      </div>
      <p class="content">
        ${c.content}
      </p>
    </div>
  </div>`;
    commentContainer.insertAdjacentHTML("beforeend", html);

    if (c.replies.length == 0) continue;

    for (const r of c.replies) {
      if (r.user.username == userName) {
        html = `
        <div class="comment reply-comment you" data-id="${r.id}">
        <div class="like">
          <img class="plus" src="images/icon-plus.svg" alt="" />
          <p>${r.score}</p>
          <img class="minus" src="images/icon-minus.svg" alt="" />
        </div>
        <div class="main-comment">
          <div class="user-detail">
            <img
              class="profile-picture"
              src="${r.user.image.png}"
              alt=""
            />
            <p class="username">${r.user.username}</p>
            <p class="user-desc">you</p>
            <p>${r.createdAt}</p>
            <div class="user-reply-btn">
              <img src="images/icon-delete.svg" alt="" />
              <p class="del">Delete</p>
              <img src="images/icon-edit.svg" alt="" />
              <p class="edit">Edit</p>
            </div>
          </div>
          <p class="content">
          <span>@${c.user.username}</span> ${r.content}
          </p>
        </div>
      </div>
      `;
      } else {
        html = `<div class="comment reply-comment" data-id="${r.id}">
          <div class="like">
            <img class="plus" src="images/icon-plus.svg" alt="" />
            <p>${r.score}</p>
            <img class="minus" src="images/icon-minus.svg" alt="" />
          </div>
          <div class="main-comment">
            <div class="user-detail">
              <img
                class="profile-picture"
                src="${r.user.image.png}"
                alt=""
              />
              <p class="username">${r.user.username}</p>
              <p>${r.createdAt}</p>
              <div class="reply">
                <img src="images/icon-reply.svg" alt="" />
                <span>Reply</span>
              </div>
            </div>
            <p class="content">
            <span>@${c.user.username}</span> ${r.content}
            </p>
          </div>
        </div>
          `;
      }
      commentContainer.insertAdjacentHTML("beforeend", html);
    }
  }
};

getComment();

let com;
id = 4;
let userRepliedTo; //for edit

commentContainer.addEventListener("click", function (e) {
  if (e.target.closest(".reply")) {
    if (
      e.target.closest(".comment").nextElementSibling == null ||
      !e.target
        .closest(".comment")
        .nextElementSibling.classList.contains("user-comment")
    ) {
      com = ` <div class="user-comment ${
        e.target.closest(".comment").classList.contains("reply-comment")
          ? "reply-user-comment"
          : ""
      }">
                <img src="${userImg}" alt="" />
                <!-- <input type="text" placeholder="Add a comment..." /> -->
                <textarea
                name=""
                id=""
                cols="10"
                rows="10"
                placeholder="Add a comment..."
                ></textarea>
                <button class="reply-btn">Send</button>
                </div> `;

      e.target.closest(".comment").insertAdjacentHTML("afterend", com);
      // e.insertAdjacentHTML("beforeend", com);
    } else {
      e.target.closest(".comment").nextElementSibling.remove();
    }
  }
  if (e.target.closest(".reply-btn")) {
    // console.log(e.target.closest(".reply-btn").previousElementSibling.value);
    const repliedTo =
      e.target.parentElement.previousElementSibling.querySelector(
        ".username"
      ).textContent;
    id++;
    let html_new = `
    <div class="comment reply-comment you" data-id="${id}">
    <div class="like">
      <img class="plus" src="images/icon-plus.svg" alt="" />
      <p>0</p>
      <img class="minus" src="images/icon-minus.svg" alt="" />
    </div>
    <div class="main-comment">
      <div class="user-detail">
        <img
          class="profile-picture"
          src="${userImg}"
          alt=""
        />
        <p class="username">${userName}</p>
        <p class="user-desc">you</p>
        <p>1 sec ago</p>
        <div class="user-reply-btn">
          <img src="images/icon-delete.svg" alt="" />
          <p class="del">Delete</p>
          <img src="images/icon-edit.svg" alt="" />
          <p class="edit">Edit</p>
        </div>
      </div>
      <p class="content">
        <span>@${repliedTo}</span> ${
      e.target.closest(".reply-btn").previousElementSibling.value
    }
      </p>
    </div>
  </div>
  `;
    e.target
      .closest(".user-comment")
      .previousElementSibling.insertAdjacentHTML("afterend", html_new);
    e.target.closest(".user-comment").remove();
    // e.target.closest(".comment").insertAdjacentHTML("afterend", html_new);
  }
  if (e.target.closest(".del")) {
    e.target.closest(".comment").remove();
    id--;
  }
  if (e.target.closest(".edit")) {
    let temp = e.target
      .closest(".comment")
      .querySelector(".content")
      .textContent.trim()
      .split(" ")
      .slice(1)
      .join(" ");
    userRepliedTo = e.target
      .closest(".comment")
      .querySelector(".content")
      .textContent.trim()
      .split(" ")
      .shift();
    console.log(userRepliedTo);
    let html = `<div class="edit-container">
      <textarea class="edit-ver" type="text">
      ${temp}
      </textarea>
      <button class="update">Update</button>
      </div>`;
    e.target.closest(".comment").querySelector(".content").innerHTML = "";

    e.target
      .closest(".comment")
      .querySelector(".main-comment")
      .insertAdjacentHTML("beforeend", html);
  }
  if (e.target.closest(".update")) {
    console.log(userRepliedTo);
    let temp = e.target.closest(".comment").querySelector(".edit-ver").value;
    e.target.closest(".comment").querySelector(".content").innerHTML =
      `<span>${userRepliedTo}</span>` + " " + temp;
    e.target.closest(".comment").querySelector(".edit-container").remove();
  }

  if (e.target.closest(".plus")) {
    if (!likes[e.target.closest(".comment").dataset.id]) {
      e.target.nextElementSibling.textContent =
        Number(e.target.nextElementSibling.textContent) + 1;
      likes[e.target.closest(".comment").dataset.id] = 1;
    } else if (likes[e.target.closest(".comment").dataset.id] == 0) {
      e.target.nextElementSibling.textContent =
        Number(e.target.nextElementSibling.textContent) + 1;
      likes[e.target.closest(".comment").dataset.id] = 1;
    } else if (likes[e.target.closest(".comment").dataset.id] == -1) {
      e.target.nextElementSibling.textContent =
        Number(e.target.nextElementSibling.textContent) + 1;
      likes[e.target.closest(".comment").dataset.id] = 0;
    }
  }

  if (e.target.closest(".minus")) {
    // if (
    //   !likes[e.target.closest(".comment").dataset.id] ||
    //   likes[e.target.closest(".comment").dataset.id] > -1
    // )
    //   e.target.previousElementSibling.textContent =
    //     Number(e.target.previousElementSibling.textContent) - 1;
    // likes[e.target.closest(".comment").dataset.id] -= 1;
    if (!likes[e.target.closest(".comment").dataset.id]) {
      e.target.previousElementSibling.textContent =
        Number(e.target.previousElementSibling.textContent) - 1;
      likes[e.target.closest(".comment").dataset.id] = -1;
    } else if (likes[e.target.closest(".comment").dataset.id] == 0) {
      e.target.previousElementSibling.textContent =
        Number(e.target.previousElementSibling.textContent) - 1;
      likes[e.target.closest(".comment").dataset.id] = -1;
    } else if (likes[e.target.closest(".comment").dataset.id] == 1) {
      e.target.previousElementSibling.textContent =
        Number(e.target.previousElementSibling.textContent) - 1;
      likes[e.target.closest(".comment").dataset.id] = 0;
    }
  }
});

submit.addEventListener("click", function () {
  let comment = document.querySelector(".commenting").value;
  id++;
  let html_new = `
        <div class="comment you" data-id="${id}">
        <div class="like">
          <img class="plus" src="images/icon-plus.svg" alt="" />
          <p>0</p>
          <img class="minus" src="images/icon-minus.svg" alt="" />
        </div>
        <div class="main-comment">
          <div class="user-detail">
            <img
              class="profile-picture"
              src="${userImg}"
              alt=""
            />
            <p class="username">${userName}</p>
            <p class="user-desc">you</p>
            <p>1 sec ago</p>
            <div class="user-reply-btn">
              <img src="images/icon-delete.svg" alt="" />
              <p class="del">Delete</p>
              <img src="images/icon-edit.svg" alt="" />
              <p class="edit">Edit</p>
            </div>
          </div>
          <p class="content">
            ${comment}
          </p>
        </div>
      </div>
      `;
  document.querySelector(".commenting").value = "";
  commentContainer.insertAdjacentHTML("beforeend", html_new);
});

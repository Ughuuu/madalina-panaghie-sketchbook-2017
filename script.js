const {
  gsap,
  gsap: { to, set } } =
window;
gsap.ticker.fps(60)


function createPages(pages, bookPrefix, book, startIndex = 1){
  for (let i = 0; i < pages; i++) {
    const page = document.createElement("div")
    page.classList.add("page", "book__page", `book__page__${bookPrefix}`)
    page.style = `--page-index: ${i + 2};`
    const page1 = document.createElement("div")
    page1.classList.add("page__half", "page__half--front")
    const page2 = document.createElement("div")
    page2.classList.add("page__half", "page__half--back")

    const page1Image = document.createElement("img")
    page1Image.src = `./images/${bookPrefix}-${i*2 + startIndex}.webp`
    page1Image.loading = "lazy"
    page1Image.decoding="async"
    page1Image.height="1024"

    page1.appendChild(page1Image)

    const page2Image = document.createElement("img")
    page2Image.src = `./images/${bookPrefix}-${i*2 + startIndex + 1}.webp`
    page2Image.loading = "lazy"
    page1Image.decoding="async"
    page1Image.height="1024"
    page2.appendChild(page2Image)

    page.appendChild(page1)
    page.appendChild(page2)
    book.appendChild(page)
  }
}

function createBookEnd(pages, book) {
  const pageEnd = document.createElement("div")
  pageEnd.classList.add("page", "book__page", "book__cover", "book__cover--back")
  pageEnd.style = `--page-index: ${pages};`
  const backCover = document.createElement("div")
  backCover.classList.add("page__half", "page__half--back")
  const bookInset = document.createElement("div")
  bookInset.classList.add("book__insert")
  pageEnd.appendChild(bookInset)
  pageEnd.appendChild(backCover)
  book.appendChild(pageEnd)
}

function createBook(year, pages, startIndex, onComplete, endPos) {

  const book = document.getElementById(`book-${year}`)
  createPages(pages, year, book, startIndex)
  createBookEnd(pages, book)
  const PAGES = [...document.querySelectorAll(`.book__page__${year}`)];
  const pageCount = PAGES.length - 1;


  function updatePageCount(pageCount){
    const sheet = document.createElement('style')
    sheet.innerHTML = `
    :root {
      --page-count: ${pageCount + 3};
    }
    `;
    document.body.appendChild(sheet);
  }
  

  updatePageCount(pageCount)


  function pageSet(page, index){
    if (index === pageCount) return false;
    set(page, {
      z:index == 0 ? pageCount * 3 : (pageCount - index) * 1
    });
  }

  PAGES.forEach(pageSet)

  function initialZoom(){
    to(`.book-${year}`, {
      duration: 1,
      force3D: true,
      transform: "translate(0, -50%) scale(1)"
    });
  }

  function outroZoom(){
    PAGES.forEach(pageSet)
    to(`.book-${year}`, {
      duration: 1,
      force3D: true,
      transform: endPos
    })
  }

  function pageAnimation(page, index) {
    if (index === pageCount) return false;
    let ease = "circle"
    let duration = 3
    let delay = 1.8
    to(page, {
      rotateY: `-=${180 - index * 0.3}`,
      z: index === 0 ? -pageCount : index * 0.2,
      ease: ease,
      duration: duration,
      delay: delay * index,
      onComplete: () => {
        if (index == pageCount - 1) {
          PAGES.slice().reverse().forEach(resetPages)
        }
      },
      onStart: () => {
        pageText = index + 1
        if (index > 1) {
          pageText = index * 2
        }
        document.getElementsByClassName('footer-text')[0].textContent = `Page ${pageText} Sketchbook #${year}`
        window.history.pushState('', `Page ${pageText}`, `/?page=${pageText}&year=${year})`);
      }
    })
  }

  function resetPages(page, index){
    if (index === 0) return false;
    let ease = "circle"
    let duration = 1.4
    let delay = 0.3
    to(page, {
      rotateY: 0,
      z: index === pageCount ? pageCount : (index) * 0.2,
      ease: ease,
      duration: duration,
      delay: delay * index,
      onComplete: () => {
        if (index == pageCount - 1) {
          outroZoom()
          onComplete()
        }
      }
    })
  }
  return {PAGES, startAnimation: () => {
    initialZoom()
    TweenLite.delayedCall(1, ()=>{PAGES.forEach(pageAnimation)})
  }}
}
let firstBook = null
const book2019 = createBook(2019, 19, 93, ()=>{firstBook.startAnimation()}, "translate(140%, -50%) scale(0.5)")
const book2018 = createBook(2018, 27, 39, ()=>{book2019.startAnimation()}, "translate(80%, -50%) scale(0.5)")
const book2017 = createBook(2017, 19, 1, ()=>{book2018.startAnimation()}, "translate(-190%, -50%) scale(0.5)")
firstBook = book2017
firstBook.startAnimation();

let PLAYING = true;

function pauseOrResume(){
  PLAYING = !PLAYING;
  if (PLAYING) {
    gsap.globalTimeline.resume()
  } else {
    gsap.globalTimeline.pause()
  }
}

document.addEventListener("click", pauseOrResume);

function normalSpeed(){
  gsap.globalTimeline.timeScale(1)
}

function showOrHideDiv(className) {
  var v = document.getElementsByClassName(className)[0];
  if (v.style.display === "none") {
     v.style.display = "block";
  } else {
     v.style.display = "none";
  }
}

function hideText() {
  showOrHideDiv('footer-text')
  showOrHideDiv('title-page')
}

document.body.onkeyup = function(e){
  if(e.keyCode == 32){
    pauseOrResume()
  }
  if(e.keyCode == 39){
    normalSpeed()
  }
  console.log(e.keyCode)
  if(e.keyCode == 77){
    hideText()
  }
}

document.body.onkeydown = function(e){
  if(e.keyCode == 39){
    fastForward()
  }
}


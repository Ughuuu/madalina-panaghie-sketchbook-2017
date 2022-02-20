const {
  gsap,
  gsap: { to, set } } =
window;
gsap.ticker.fps(24)


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
    page1Image.src = `./images/${bookPrefix}-${i*2 + startIndex}.jpeg`

    page1.appendChild(page1Image)

    const page2Image = document.createElement("img")
    page2Image.src = `./images/${bookPrefix}-${i*2 + startIndex + 1}.jpeg`
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
        window.history.pushState('', `Page ${index * 2 + 1}`, '/sketchbooks?page=' + (index * 2 + 1));
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

document.addEventListener("click", function(event){
  PLAYING = !PLAYING;
  if (PLAYING) {
    gsap.globalTimeline.resume()
  } else {
    gsap.globalTimeline.pause()
  }
});

//gsap.globalTimeline.timeScale(5)


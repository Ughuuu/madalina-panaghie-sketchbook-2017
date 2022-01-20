const {
  gsap,
  gsap: { to, set } } =
window;
//gsap.ticker.fps(24)


function createPages(pages, bookPrefix){
  const book = document.getElementById("book")
  for (let i = 0; i < pages; i++) {
    const page = document.createElement("div")
    page.classList.add("page", "book__page")
    page.style = `--page-index: ${i + 2};`
    const page1 = document.createElement("div")
    page1.classList.add("page__half", "page__half--front")
    const page2 = document.createElement("div")
    page2.classList.add("page__half", "page__half--back")

    const page1Image = document.createElement("img")
    page1Image.src = `./images/${bookPrefix}-${i*2 + 1}.jpeg`
    const page1Number = document.createElement("div")

    page1Number.classList.add("page__number")
    page1.appendChild(page1Number).appendChild(document.createTextNode(`${i*2 + 1}`))

    page1.appendChild(page1Image)

    const page2Image = document.createElement("img")
    page2Image.src = `./images/${bookPrefix}-${i*2 + 2}.jpeg`
    const page2Number = document.createElement("div")
    const page2Header = document.createElement("div")
    page2Header.classList.add("page__header")
    page2Number.classList.add("page__number")
    page2.appendChild(page2Image)
    page2Header.appendChild(document.createTextNode(`Madalina Panaghie Sketchbook #${bookPrefix}`))
    page2.appendChild(page2Header)
    page2.appendChild(page2Number).appendChild(document.createTextNode(`${i*2 + 2}`))

    page.appendChild(page1)
    page.appendChild(page2)
    book.appendChild(page)
  }
  const pageEnd = document.createElement("div")
  pageEnd.classList.add("page", "book__page", "book__cover", "book__cover--back")
  pageEnd.style = `--page-index: ${pages*2 + 2};`
  const backCover = document.createElement("div")
  backCover.classList.add("page__half", "page__half--back")
  const bookInset = document.createElement("div")
  bookInset.classList.add("book__insert")
  pageEnd.appendChild(bookInset)
  pageEnd.appendChild(backCover)
  book.appendChild(pageEnd)
}

function updatePageCount(pageCount){
  const sheet = document.createElement('style')
  sheet.innerHTML = `
  :root {
    --page-count: ${pageCount + 3};
  }
  `;
  document.body.appendChild(sheet);
}

createPages(19, '2017')
const PAGES = [...document.querySelectorAll('.book__page')];
const pageCount = PAGES.length - 1;
updatePageCount(pageCount)

function pageSet(page, index){
  if (index === pageCount) return false;
  set(page, {
    z: index === 0 ? pageCount : (pageCount - index) * 0.2
  });
}

PAGES.forEach(pageSet)

function pageAnimation(page, index) {
  if (index == 0) {
    to('.book', {
      duration: 2,
      transform: "translate(0, -50%) scale(1)"
    });
  }
  if (index === pageCount) return false;
  let ease = "circle"
  let duration = 3
  let delay = 1.8
  to(page, {
    rotateY: `-=${180 - index * 0.5}`,
    z: index === 0 ? -pageCount : index * 0.2,
    ease: ease,
    duration: duration,
    delay: delay * index,
    onComplete: () => {
      if (index == pageCount - 1) {
        PAGES.slice().reverse().forEach(resetPages)
      }
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
      if (index == pageCount) {
        TweenLite.delayedCall(4, ()=> {PAGES.forEach(pageAnimation)})
        PAGES.forEach(pageSet)
        to('.book', {
          duration: 2,
          transform: "translate(-50%, -50%) scale(0.5)"
        })
      }
    }
  })
}

TweenLite.delayedCall(2, ()=>{PAGES.forEach(pageAnimation)});


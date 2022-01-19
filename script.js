const {
  gsap,
  ScrollTrigger,
  gsap: { to, set } } =
window;

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
    page1.appendChild(page1Image)
    page1.appendChild(page1Number).appendChild(document.createTextNode(`${i*2 + 1}`))

    const page2Image = document.createElement("img")
    page2Image.src = `./images/${bookPrefix}-${i*2 + 2}.jpeg`
    const page2Number = document.createElement("div")
    page2Number.classList.add("page__number")
    page2.appendChild(page2Image)
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

gsap.registerPlugin(ScrollTrigger);

to('.book', {
  scrollTrigger: {
    scrub: 1,
    start: () => 0,
    end: () => window.innerHeight * 0.25 },

  scale: 1 });


PAGES.forEach((page, index) => {
  set(page, { z: index === 0 ? pageCount : -index * 1 });
  if (index === pageCount) return false;
  to(page, {
    rotateY: `-=${180 - index / 2}`,
    scrollTrigger: {
      scrub: 1,
      start: () => (index + 1) * (window.innerHeight * 0.25),
      end: () => (index + 2) * (window.innerHeight * 0.25) } });


  to(page, {
    z: index === 0 ? -pageCount : index,
    scrollTrigger: {
      scrub: 1,
      start: () => (index + 1) * (window.innerHeight * 0.25),
      end: () => (index + 1.5) * (window.innerHeight * 0.25) } });


});
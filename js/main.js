// PROVIDED: catalogue, page references, and initial gallery.
const $cats = [
  { id: 'taco', name: 'Taco', bio: 'A playful explorer who loves cardboard boxes.', image: 'images/kitten1.jpeg' },
  { id: 'mochi', name: 'Mochi', bio: 'A quiet companion and expert sunbeam finder.', image: 'images/kitten2.jpeg' },
  { id: 'pepper', name: 'Pepper', bio: 'The fastest toy mouse catcher in the café.', image: 'images/kitten3.jpeg' },
  { id: 'waffles', name: 'Waffles', bio: 'A champion napper with a very loud purr.', image: 'images/kitten4.jpeg' }
]
// Select the page elements we will update.
const $gallery = document.querySelector('#gallery')
const $status = document.querySelector('#status')
// Keep the current choices in JavaScript; the page displays these values.
let $favouriteIds = []
let $selectedCatId = ''
let $notes = []
let $isDark = false

// Only trusted catalogue values are inserted into this HTML string.
for (const $cat of $cats) {
  $gallery.insertAdjacentHTML('beforeend', `
    <article class="card">
      <img src="${$cat.image}" alt="${$cat.name}, a café cat">
      <h3>${$cat.name}</h3>
      <p>${$cat.bio}</p>
      <div class="actions">
        <button class="view-profile" data-id="${$cat.id}">View profile</button>
        <button class="favourite" data-id="${$cat.id}" aria-pressed="false"><span aria-hidden="true">🖤</span> Favourite</button>
      </div>
    </article>
  `)
}

// WEEK 9 — STEP 1: Build steps/01.js together here.
const $themeButton = document.getElementById("theme-toggle")

$themeButton.addEventListener("click", toggleTheme)

function toggleTheme() {
  $isDark = !$isDark
  updateTheme()
  // week 10 - step - save choices
  saveChoices()
}

function updateTheme() {
  document.body.classList.toggle("dark", $isDark)
  $themeButton.setAttribute('aria-pressed', $isDark)
  // ? : is the if then expression, ? (if true) : (if false)
  $themeButton.textContent = $isDark ? "Use light background" : "Use dark background"
}

// WEEK 9 — STEP 2: Build steps/02.js together here.
const $profileButtons = document.querySelectorAll(".view-profile")

for (const $button of $profileButtons) {
  $button.addEventListener("click", showProfile)
}

function showProfile($event) {
  const $catId = $event.target.dataset.id
  const $cat = findCat($catId)
  $selectedCatId = $cat.id

  // call show notes from step 4 to show notes for selected cat
  showNotes()

  document.getElementById("profile-image").src = $cat.image
  document.getElementById("profile-image").alt = $cat.name + ", a cafe cat"
  document.getElementById("profile-name").textContent = $cat.name
  document.getElementById("profile-bio").textContent = $cat.bio
  document.getElementById("profile").hidden = false
  document.getElementById("notes-fieldset").disabled = false
}

function findCat($id) {
  for (const $cat of $cats) {
    if ($cat.id === $id) return $cat
  }
}

// WEEK 9 — STEP 3: Build steps/03.js together here.
$gallery.addEventListener("click", toggleFavourite)

function toggleFavourite($event) {
  const $button = $event.target.closest(".favourite")
  if (!$button) return
  const $id = $button.dataset.id

  const $index = $favouriteIds.indexOf($id)
  if ($index === -1) {
    // add cat id to favouriteIds
    $favouriteIds.push($id)
  } else {
    // remove the cat id from favouriteIds
    $favouriteIds.splice($index, 1)
  }
  updateFavourites()
}

function updateFavourites() {
  const $buttons = document.querySelectorAll(".favourite")
  for (const $button of $buttons) {
    const $isFavourite = $favouriteIds.includes($button.dataset.id)
    $button.classList.toggle("selected", $isFavourite)
    $button.setAttribute("aria-pressed", $isFavourite)
    $button.innerHTML = $isFavourite
      ? `<span aria-hidden="true">❤️</span> Favourited`
      : `<span aria-hidden="true">🖤</span> Favourite`
  }
  document.getElementById("favourite-count").textContent = $favouriteIds.length
}

// WEEK 9 — STEP 4: Build steps/04.js together here.
const $notesForm = document.getElementById("notes-form")
const $notesList = document.getElementById("notes-list")

$notesForm.addEventListener("submit", addNote)

function addNote($event) {
  $event.preventDefault()
  const $text = $notesForm.elements.note.value.trim()

  if ($text === '' || $selectedCatId === '') {
    $status.textContent = "Select a cat and enter a note"
    return
  }
  $notes.push({ catId: $selectedCatId, text: $text })

  showNotes()

  $notesForm.reset()
  $notesForm.elements.note.focus()
  $status.textContent = "Note added."
  // week 10 - step 1 save choices
  saveChoices()
}
function showNotes() {
  $notesList.replaceChildren() // clear the list contents

  for (let $index = 0; $index < $notes.length; $index++) {
    // get the note from notes array based on index value
    const $note = $notes[$index]
    // check if the catId saved in the note matches with selected cat id
    if ($note.catId === $selectedCatId) {
      const $noteTemplate = `<li>
      <span>${$note.text}<span>
      <button data-index="${$index}" type="button" class="remove-note">Remove</button>
      </li>`
      $notesList.insertAdjacentHTML("beforeend", $noteTemplate)
    }// closes if
  }// closes for loop
}// closes function showNotes


// WEEK 9 — STEP 5: Build steps/05.js together here.

$notesList.addEventListener("click", removeNote)

function removeNote($event) {
  const $button = $event.target.closest(".remove-note")

  if (!$button) return

  const $index = Number($button.dataset.index)
  $notes.splice($index, 1)
  showNotes()
  $status.textContent = "Note removed."
}

// week 10 - local storage and fetch 

const $storageKey = "mtm6302-cat-choices"
function saveChoices(){
  const $choices = {favIds: $favouriteIds, dark: $isDark, notes: $notes}
  try {

  localStorage.setItem($storageKey, JSON.stringify($choices))
  $status.textContent = "choices and notes saved "

  } catch (error) {
    console.error(error)
    $status.textContent = "Unable to save changes in the browser."

  }
}

// week 10 - step 2 - read saved choices and reuse display function 

function localChoices(){
  try{
    const $savedChoices = localStorage.getItem($storageKey)
    if ($savedChoices === null){
      $status.textContent = "No saved choices found"
      return
    }
    const $choices = JSON.parse($savedChoices)
    $favouriteIds = $choices.favIds
    $isDark = $choices.dark
    $notes = $choices.notes

    updateFavourites()
    updateTheme()
    showNotes()

    $status.textContent = "Saved choices and notes restored."

  }catch (error){
    console.error(error)
    $status.textContent = "Unable to load saved choices."

  }
}

// week 10 - step 4 - reset data and the page
document.getElementById("clear-choices").addEventListener("click", clearChoices)

function clearChoices(){
  try {
    localStorage.removeItem($storageKey)
    $favouriteIds = []
    $isDark = false
    $notes = []
    $selectedCatId = ''

    updateFavourites()
    updateTheme()
    showNotes()

    $notesForm.reset()
    document.getElementById("notes-fieldset").disabled = true
    document.getElementById("profile").hidden = true

    $status.textContent = "page rest completed."

  }catch (error){
    console.error(error)
    $status.textContent= "Unable to save choices."
  }
}

// week 10 - step 5 - 
const $factButton = document.getElementById("get-fact")
const $factOutput = document.getElementById("fact")

$factButton.addEventListener("click", fetchCatFact)

async function fetchCatFact(){
  $factButton.disabled = true
  $factOutput.textContent = "loading a cat fact..."

  try{
    const $response = await fetch("https://catfact.ninja/fact")
    const $data = await $response.json()
    $factOutput.textContent = $data.fact

  } catch (error){
  console.error(error)
  $factOutput.textContent = "Unable to load a cat fact, please refresh and try"


  }
  $factButton.disabled = false

}
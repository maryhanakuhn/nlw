//console.log("Hello")

function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(res => res.json())
        .then(states => {

            for (state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
                console.log(state)
            }
        })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
        .then(res => res.json())
        .then(cities => {

            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }
            citySelect.disabled = false
        })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

//itens de coleta
//pegar todos os li's
const itemToCollect = document.querySelectorAll(".items-grid li")


//para cada item executo uma callbak function
for (const item of itemToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target
    //adicionar ou remover uma classe com java script
    itemLi.classList.toggle("selected")

    const itemId = event.target.dataset.id

    //verificar se existem itens selecionados, se sim
    //pegar os itens selecionados
    const alreadySelected = selectedItems.findIndex(item => {
        const itemFound = item == itemId // isso será true ou false
        return itemFound
    })

    //se já estiver selecionado tirar da seleção
    if (alreadySelected >= 0) {
        //tirar da seleção
        const filteresItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId // false
            return itemIsDifferent
        })
        selectedItems = filteresItems

    } else {
        //se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)

    }
    console.log(selectedItems)

    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}
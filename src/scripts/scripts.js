async function getClient (id) {
  const response = await fetch(`http://localhost:3000/clients/${id}`)
  const data = await response.json()

  if (data) {
    return data
  }

  return null
}

function createHistoryItem (itemHistory) {
  const historyItem = document.createElement('div')
  const containerItem = document.createElement('div')
  const timeItem = document.createElement('span')
  const icontItem = document.createElement('i')

  historyItem.setAttribute('class', 'history-item')
  icontItem.setAttribute('class', 'ph ph-seal-check')

  containerItem.innerHTML = itemHistory.date
  timeItem.innerHTML = itemHistory.time

  containerItem.append(timeItem)
  historyItem.append(containerItem)
  historyItem.append(icontItem)

  return historyItem
}

function updateProfileData (name, since) {
  document.getElementById('client_name').textContent = name
  document.getElementById('client_since').textContent = `Cliente desde ${since}`
}

function updateHistoryData (historic) {
  const historyItems = document.getElementById('history_items')

  if (historyItems) {
    historic.forEach(history => {
      const item = createHistoryItem(history)
      
      if (item) {
        historyItems.appendChild(item)
      }
    })
  }
}

function setStampOnCard (totalCuts) {
  const slots = document.getElementsByClassName('slot')

  for (let slot of slots) {
    slot.innerHTML = ''
  }

  const slotsNumbers = Array.from({ length: totalCuts }, (v, i) => i)
  
  slotsNumbers.forEach(slot => {
    const stampImage = document.createElement('img')
    stampImage.setAttribute('src', '/src/assets/svg/pin-check.svg')

    slots[slot].append(stampImage)
  })
}

function updateSlideData (summary) {
  document.getElementById('progress-total').textContent = summary.totalCuts
  document.getElementById('progress-bar-label').textContent = `${summary.totalCuts} de ${summary.cutsNeeded}`

  const progressBar = document.getElementById('progress-bar')
  progressBar.value = summary.totalCuts

}

export async function searchClientById (id = '124-537-835-230') {
  try {
    const client = await getClient(id)
  
    if (client) {
      updateProfileData(client.name, client.clientSince)
      updateHistoryData(client.appointmentHistory)
  
      setStampOnCard(client.loyaltyCard.totalCuts)
      updateSlideData(client.loyaltyCard)
    }
  } catch (error) {
    console.error('Houver um erro ao buscar o cliente')
    throw error  
  }
}

await searchClientById()

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault()
  event.stopPropagation()

  const clientID = document.getElementById('id_card').value
  
  if (!clientID) {
    return
  }

  searchClientById(clientID)
})

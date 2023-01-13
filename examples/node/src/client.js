document.addEventListener('DOMContentLoaded', async () => { 
  const loggedIn = await fetch('/logged-in').then(res => res.json())
  if(loggedIn.token) {
    document.getElementById('login-wrapper').style.display = 'none'
    document.getElementById('logged-in-wrapper').style.display = 'block'

    // fetch options
    const dateRange = document.getElementById('date-range')
    const options = await fetch('/date-ranges').then((res) => res.json())
    options.map((option) => {
      const opt = document.createElement('option');
      opt.value = JSON.stringify(option.value);
      opt.innerHTML = option.label;
      dateRange.appendChild(opt);
    })

    // fetch & display data
    const getOwj = document.getElementById('get-owj')
    const journeysTotal = document.getElementById('journeys-total')
    const journeys = document.getElementById('journeys')
    const rawJourneys = document.getElementById('raw-journeys')
    getOwj.addEventListener('click', async () => {
      getOwj.disabled = true
      const selectedValue = JSON.parse(dateRange.value)
      journeys.innerHTML = '<p>Loading orders</p>'
      journeysTotal.innerHTML = ''
      rawJourneys.innerHTML = ''
  
      const orderJourneys = await fetch('/get-orders-with-journeys', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: selectedValue.start,
          endDate: selectedValue.end
        })
      }).then(res => res.json())

      // jwt expired
      if(orderJourneys.message) {
        journeysTotal.innerHTML = orderJourneys.message
        return
      }

      journeysTotal.innerHTML = `<p>Total Orders: ${orderJourneys.totalForRange}</p>`
      journeys.innerHTML = `
      <div class="Polaris-Card">
        <div class="Polaris-DataTable Polaris-DataTable__ShowTotals">
            <div class="Polaris-DataTable__ScrollContainer">
              <table class="Polaris-DataTable__Table">
                <thead>
                  <tr>
                    <th data-polaris-header-cell="true" class="Polaris-DataTable__Cell Poxaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header" scope="col">Order ID</th>
                    <th data-polaris-header-cell="true" class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric" scope="col">Journey Length</th>
                    <th data-polaris-header-cell="true" class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric" scope="col">First Click</th>
                    <th data-polaris-header-cell="true" class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric" scope="col">Last Click</th>
                    <th data-polaris-header-cell="true" class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric" scope="col">Last Platform Click</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      `

      const journeysTBody = journeys.querySelector('tbody')
      orderJourneys.ordersWithJourneys?.forEach((order) => {
        const j = document.createElement('tr');
        j.classList.add('Polaris-DataTable__TableRow', 'Polaris-DataTable--hoverable')
        j.innerHTML = `
        <th class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn" scope="row">${order.orderId ?? ''}</th>
        <td class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">${order.journey?.length ?? ''}</td>
        <td class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">${order.attribution?.firstClick?.source ?? ''}</td>
        <td class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">${order.attribution?.lastClick?.source ?? ''}</td>
        <td class="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">${order.attribution?.lastPlatformClick?.map((click) => click.source ?? '').flat().toString().replace(/,/g, '<br>')}</td>
        `
        journeysTBody.appendChild(j);
      })
  
      rawJourneys.innerHTML = JSON.stringify(orderJourneys)
      getOwj.disabled = false
    })

  } else {
    // login
    const login = document.getElementById('login')
    login.addEventListener('click', async () => {
      login.disabled = true
  
      const loginFetch = await fetch('/login', {
        headers: {
        'Content-Type': 'application/json'
        }
      }).then(res => res.json())
  
      login.disabled = false
  
      if(!!loginFetch?.redirect) {
        window.location = loginFetch.redirect
      }
    })
  }
})
const baseURL = 'https://api.coingecko.com/api/v3';


const pageLoad = () => {
    let form = document.querySelector('#contractForm')
    form.innerHTML = ` 
    <form id = "form">
    <label for="contract-label">Token:</label>
    <input type="text" id="contract" placeholder="Please enter the name of a cryptocurrency (i.e: bitcoin)"></form>`
    
    const contract = document.querySelector('#form')
    contract.addEventListener('submit', function(event){
        event.preventDefault()
        let crypto = document.querySelector('#contract').value
        contractDeploy(crypto)
    })
  
}


const contractDeploy = (crypto) => {
    document.querySelector('#crypto').innerHTML = crypto
    fetch(`${baseURL}/coins/${crypto}`)
        .then(request => request.json())
        .then(response => { 
            let description = response.description.en
            let name = response.name
            let symbol = response.symbol
            let img = response.image.small
            let info = document.querySelector('#info')
            info.innerHTML = 
                `
                <h2 id ="description">General Info</h2>
                <p>${description}</p>`
                    
            let data = document.querySelector('#right')
            let market = response.market_data
            let price = market.current_price.usd
            let supply = market.circulating_supply
            let mcap = market.market_cap.usd
            let ath = market.ath.usd
            let atl = market.atl.usd
            let high_24= market.high_24h.usd
            let low_24 = market.low_24h.usd
            let prcnt = market.price_change_percentage_24h_in_currency.usd
            data.innerHTML += `
                <img id = "token" src = "${img}"/>
                <div id = "ticker"><h2>${name} </h2></div>
                <p id="highlight"><b>All Time High:</b> $${ath}</p>
                <p id ="highlight"><b>All Time Low: </b>$${atl}</p>
                <p id = "price"><b id="price">Current Price: </b>$${price}</p>
                <p><b>Circulating Supply: </b>${supply} tokens</p>
                <p><b>Market Capitalization: </b>$${mcap}</p>
               
                <p><b>Highest Price in 24H: </b>$${high_24}</p>
                <p><b>Lowest Price In 24H: </b>$${low_24}</p>
                <P><b>Percentage Change Last 24H: </b>${prcnt}%</p>
                <form id="alertForm">
                    <label><b>Alert me at price:</b></label><input id = "alert" type = "text">
                </form>
                <form method = "post" action="/submit" id="Email"> 
                    <b>Send me this data by email: </b>
                    <input id = "emailForm" type="text" name="user[email]" placeholder = "replaceme@gmail.com">
                    <input id = "dataSend" type = "text" name = "data" value = "Name: ${name}; Price: $${price}; ATH: $${ath}; ATL:$${atl}; Supply: ${supply} tokens; Market Cap: $${mcap}; Lowest in 24h: $${low_24}; Highest in 24h: $${high_24}">
                    <input type="submit" id = "submitEmail" value="Send email" action="">
                    </form>
                `
                
                let check = document.querySelector('#Email')
                check.addEventListener('submit', function(e){
                    if(document.querySelector('#emailForm').value == ""){
                        e.preventDefault();
                        window.alert("Please enter an email before submitting.")
                    }
                   
                })

                
                const alert = document.querySelector('#alertForm')
                alert.addEventListener('submit', function(event){
                    event.preventDefault()
                    PriceUpdates()
                })

        })
        PriceUpdates()
        
        let vis = document.querySelector('#mid').innerHTML = `<div id = "midFilled"> <h2 id ="daily">Average Daily Price Over Last 7 Days:</h2>
                                                                <div id="chart"></div></div>`
        let id = document.querySelector('#contract').value
        document.querySelector('#midFilled').innerHTML += 
                                `<div id = "options">
                                    <button type = "button" id ="days7" onclick=Chart7()>7 days</button>
                                    <button type = "button" id ="days14" onclick=Chart14()>14 days</button>
                                    <button type = "button" id = "month" onclick =ChartMonth()>1 Month</button>
                                    <button type = "button" id = "months3" onclick =ChartMonth3()>3 Months</button>
                                    <button type = "button" id ="months6" onclick = ChartMonth6()>6 Months</button>
                                    <button type = "button" id ="year" onclick = ChartYear()>1 Year</button>
                                </div>`


        fetch(`${baseURL}/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`)
            .then(request => request.json())
            .then(response => {
            
                let prices = response.prices
                let col = "lightgreen"
                if(prices[0][1] > prices[prices.length-1][1]){
                    col = "tomato"
                }
                
                
                let name = id.charAt(0).toUpperCase()  + id.slice(1) 
                var chart = new CanvasJS.Chart("chart", {
                    animationEnabled: true,
                    theme: "dark2",
                    title:{
                        text: `${name} Price Chart`
                    },
                    data: [{  
                        color: col,      
                        type: "area",
                          indexLabelFontSize: 16,
                        dataPoints: [
                            
                        ]
                        
                    }],
                    options:{
                        animation: true
                    }
                });
                
                chart.render()
                for(let i = 0; i < prices.length - 1; i++){
                    let d = {x:new Date(prices[i][0]), y:prices[i][1]}
                    chart.data[0].dataPoints.push(d);
                }
                chart.render()
                
                
            })
  
};


const PriceUpdates = (alertPrice) => {
    //query coingecko API every 5 seconds for a new price
    setTimeout(PriceUpdates, 10000)
   
    let crypto = document.querySelector('#crypto').innerHTML
    fetch(`${baseURL}/coins/${crypto}`)
        .then(request => request.json())
        .then(response => { 
            let market = response.market_data
            let price = market.current_price.usd
            console.log(price)
            let p = document.querySelector('#price')
            p.innerHTML = `<b id ="price">Current Price: </b>$${price}`
            let alertPrice = document.querySelector('#alert').value
            if(alertPrice != ""){
                if(price >= alertPrice){
                    window.alert(`Price boundary has been crossed! Current price is: $${price}`)
                    document.querySelector('#alert').value = ''
                }}

        })

}

const Chart7 = () => {
    let vis = document.querySelector('#mid').innerHTML = `<div id = "midFilled"> <h2 id ="daily">Average Daily Price Over Last 7 Days:</h2>
                                                                <div id="chart"></div></div>`
    let id = document.querySelector('#contract').value
    document.querySelector('#midFilled').innerHTML += 
                            `<div id = "options">
                            <button type = "button" id ="days7" onclick=Chart7()>7 days</button>
                            <button type = "button" id ="days14" onclick=Chart14()>14 days</button>
                            <button type = "button" id = "month" onclick =ChartMonth()>1 Month</button>
                            <button type = "button" id = "months3" onclick =ChartMonth3()>3 Months</button>
                            <button type = "button" id ="months6" onclick = ChartMonth6()>6 Months</button>
                            <button type = "button" id ="year" onclick = ChartYear()>1 Year</button>
                            </div>`
    
    fetch(`${baseURL}/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`)
            .then(request => request.json())
            .then(response => {
            
                let prices = response.prices
                let col = "lightgreen"
                if(prices[0][1] > prices[prices.length-1][1]){
                    col = "tomato"
                }
                
                
                let name = id.charAt(0).toUpperCase()  + id.slice(1) 
                var chart = new CanvasJS.Chart("chart", {
                    animationEnabled: true,
                    theme: "dark2",
                    title:{
                        text: `${name} Price Chart`
                    },
                    data: [{  
                        color: col,      
                        type: "area",
                          indexLabelFontSize: 16,
                        dataPoints: [
                            
                        ]
                        
                    }],
                    options:{
                        animation: true
                    }
                });
                
                chart.render()
                for(let i = 0; i < prices.length - 1; i++){
                    let d = {x:new Date(prices[i][0]), y:prices[i][1]}
                    chart.data[0].dataPoints.push(d);
                }
                chart.render()
                
                
            })
}

const Chart14 = () => {
    let vis = document.querySelector('#mid').innerHTML = `<div id = "midFilled"> <h2 id ="daily">Average Daily Price Over Last 14 Days:</h2>
                                                                <div id="chart"></div></div>`
    let id = document.querySelector('#contract').value
    document.querySelector('#midFilled').innerHTML += 
                            `<div id = "options">
                            <button type = "button" id ="days7" onclick=Chart7()>7 days</button>
                            <button type = "button" id ="days14" onclick=Chart14()>14 days</button>
                            <button type = "button" id = "month" onclick =ChartMonth()>1 Month</button>
                            <button type = "button" id = "months3" onclick =ChartMonth3()>3 Months</button>
                            <button type = "button" id ="months6" onclick = ChartMonth6()>6 Months</button>
                            <button type = "button" id ="year" onclick = ChartYear()>1 Year</button>
                            </div>`
    
    fetch(`${baseURL}/coins/${id}/market_chart?vs_currency=usd&days=14&interval=daily`)
            .then(request => request.json())
            .then(response => {
            
                let prices = response.prices
                let col = "lightgreen"
                if(prices[0][1] > prices[prices.length-1][1]){
                    col = "tomato"
                }
                
                
                let name = id.charAt(0).toUpperCase()  + id.slice(1) 
                var chart = new CanvasJS.Chart("chart", {
                    animationEnabled: true,
                    theme: "dark2",
                    title:{
                        text: `${name} Price Chart`
                    },
                    data: [{  
                        color: col,      
                        type: "area",
                          indexLabelFontSize: 16,
                        dataPoints: [
                            
                        ]
                        
                    }],
                    options:{
                        animation: true
                    }
                });
                
                chart.render()
                for(let i = 0; i < prices.length - 1; i++){
                    let d = {x:new Date(prices[i][0]), y:prices[i][1]}
                    chart.data[0].dataPoints.push(d);
                }
                chart.render()
                
                
            })
}

const ChartMonth = () =>{
    let vis = document.querySelector('#mid').innerHTML = `<div id = "midFilled"> <h2 id ="daily">Average Daily Price Over Last Month:</h2>
                                                                <div id="chart"></div></div>`
    let id = document.querySelector('#contract').value
    document.querySelector('#midFilled').innerHTML += 
                            `<div id = "options">
                            <button type = "button" id ="days7" onclick=Chart7()>7 days</button>
                            <button type = "button" id ="days14" onclick=Chart14()>14 days</button>
                            <button type = "button" id = "month" onclick =ChartMonth()>1 Month</button>
                            <button type = "button" id = "months3" onclick =ChartMonth3()>3 Months</button>
                            <button type = "button" id ="months6" onclick = ChartMonth6()>6 Months</button>
                            <button type = "button" id ="year" onclick = ChartYear()>1 Year</button>
                            </div>`
    
    fetch(`${baseURL}/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`)
            .then(request => request.json())
            .then(response => {
            
                let prices = response.prices
                let col = "lightgreen"
                if(prices[0][1] > prices[prices.length-1][1]){
                    col = "tomato"
                }
                
                
                let name = id.charAt(0).toUpperCase()  + id.slice(1) 
                var chart = new CanvasJS.Chart("chart", {
                    animationEnabled: true,
                    theme: "dark2",
                    title:{
                        text: `${name} Price Chart`
                    },
                    data: [{  
                        color: col,      
                        type: "area",
                          indexLabelFontSize: 16,
                        dataPoints: [
                            
                        ]
                        
                    }],
                    options:{
                        animation: true
                    }
                });
                
                chart.render()
                for(let i = 0; i < prices.length - 1; i++){
                    let d = {x:new Date(prices[i][0]), y:prices[i][1]}
                    chart.data[0].dataPoints.push(d);
                }
                chart.render()
                
                
            })  

}


const ChartMonth3 = () =>{
    let vis = document.querySelector('#mid').innerHTML = `<div id = "midFilled"> <h2 id ="daily">Average Daily Price Over Last 3 Months:</h2>
                                                                <div id="chart"></div></div>`
    let id = document.querySelector('#contract').value
    document.querySelector('#midFilled').innerHTML += 
                            `<div id = "options">
                            <button type = "button" id ="days7" onclick=Chart7()>7 days</button>
                            <button type = "button" id ="days14" onclick=Chart14()>14 days</button>
                            <button type = "button" id = "month" onclick =ChartMonth()>1 Month</button>
                            <button type = "button" id = "months3" onclick =ChartMonth3()>3 Months</button>
                            <button type = "button" id ="months6" onclick = ChartMonth6()>6 Months</button>
                            <button type = "button" id ="year" onclick = ChartYear()>1 Year</button>
                            </div>`
    
    fetch(`${baseURL}/coins/${id}/market_chart?vs_currency=usd&days=90&interval=daily`)
            .then(request => request.json())
            .then(response => {
            
                let prices = response.prices
                let col = "lightgreen"
                if(prices[0][1] > prices[prices.length-1][1]){
                    col = "tomato"
                }
               
                
                let name = id.charAt(0).toUpperCase()  + id.slice(1) 
                var chart = new CanvasJS.Chart("chart", {
                    animationEnabled: true,
                    theme: "dark2",
                    title:{
                        text: `${name} Price Chart`
                    },
                    data: [{  
                        color: col,      
                        type: "area",
                          indexLabelFontSize: 16,
                        dataPoints: [
                            
                        ]
                        
                    }],
                    options:{
                        animation: true
                    }
                });
                
                chart.render()
                for(let i = 0; i < prices.length - 1; i++){
                    let d = {x:new Date(prices[i][0]), y:prices[i][1]}
                    chart.data[0].dataPoints.push(d);
                }
                chart.render()
                
                
            })  

}

const ChartMonth6 = () =>{
    let vis = document.querySelector('#mid').innerHTML = `<div id = "midFilled"> <h2 id ="daily">Average Daily Price Over Last 6 Months:</h2>
                                                                <div id="chart"></div></div>`
    let id = document.querySelector('#contract').value
    document.querySelector('#midFilled').innerHTML += 
                            `<div id = "options">
                            <button type = "button" id ="days7" onclick=Chart7()>7 days</button>
                            <button type = "button" id ="days14" onclick=Chart14()>14 days</button>
                            <button type = "button" id = "month" onclick =ChartMonth()>1 Month</button>
                            <button type = "button" id = "months3" onclick =ChartMonth3()>3 Months</button>
                            <button type = "button" id ="months6" onclick = ChartMonth6()>6 Months</button>
                            <button type = "button" id ="year" onclick = ChartYear()>1 Year</button>
                            </div>`
    
    fetch(`${baseURL}/coins/${id}/market_chart?vs_currency=usd&days=180&interval=daily`)
            .then(request => request.json())
            .then(response => {
            
                let prices = response.prices
                let col = "lightgreen"
                if(prices[0][1] > prices[prices.length-1][1]){
                    col = "tomato"
                }
                
                
                let name = id.charAt(0).toUpperCase()  + id.slice(1) 
                var chart = new CanvasJS.Chart("chart", {
                    animationEnabled: true,
                    theme: "dark2",
                    title:{
                        text: `${name} Price Chart`
                    },
                    data: [{  
                        color: col,      
                        type: "area",
                          indexLabelFontSize: 16,
                        dataPoints: [
                            
                        ]
                        
                    }],
                    options:{
                        animation: true
                    }
                });
                
                chart.render()
                for(let i = 0; i < prices.length - 1; i++){
                    let d = {x:new Date(prices[i][0]), y:prices[i][1]}
                    chart.data[0].dataPoints.push(d);
                }
                chart.render()
                
                
            })  

}

const ChartYear = () =>{
    let vis = document.querySelector('#mid').innerHTML = `<div id = "midFilled"> <h2 id ="daily">Average Daily Price Over This Year:</h2>
                                                                <div id="chart"></div></div>`
    let id = document.querySelector('#contract').value
    document.querySelector('#midFilled').innerHTML += 
                            `<div id = "options">
                            <button type = "button" id ="days7" onclick=Chart7()>7 days</button>
                            <button type = "button" id ="days14" onclick=Chart14()>14 days</button>
                            <button type = "button" id = "month" onclick =ChartMonth()>1 Month</button>
                            <button type = "button" id = "months3" onclick =ChartMonth3()>3 Months</button>
                            <button type = "button" id ="months6" onclick = ChartMonth6()>6 Months</button>
                            <button type = "button" id ="year" onclick = ChartYear()>1 Year</button>
                            </div>`
    
    fetch(`${baseURL}/coins/${id}/market_chart?vs_currency=usd&days=365&interval=daily`)
            .then(request => request.json())
            .then(response => {
            
                let prices = response.prices
                let col = "lightgreen"
                if(prices[0][1] > prices[prices.length-1][1]){
                    col = "tomato"
                }
                
                
                let name = id.charAt(0).toUpperCase()  + id.slice(1) 
                var chart = new CanvasJS.Chart("chart", {
                    animationEnabled: true,
                    theme: "dark2",
                    title:{
                        text: `${name} Price Chart`
                    },
                    data: [{  
                        color: col,      
                        type: "area",
                          indexLabelFontSize: 16,
                        dataPoints: [
                            
                        ]
                        
                    }],
                    options:{
                        animation: true
                    }
                });
                
                chart.render()
                for(let i = 0; i < prices.length - 1; i++){
                    let d = {x:new Date(prices[i][0]), y:prices[i][1]}
                    chart.data[0].dataPoints.push(d);
                }
                chart.render()
                
                
            })  

}


pageLoad()

//global game settings

var settings = {
    costIncrease: 1.15,
    costRefund: 0.5
}

//resources

var resources = {
    money: 1000,
    coffees: 0,
    coffeePrice: 1,
    fish: 0,
    fishPrice: 5,
    fishHunger: 10
}

//buildings

var barista = {
    count: 0,
    cost: 10,
    perSecond: 1
}

var cashier = {
    count: 0,
    cost: 10,
    perSecond: 1
}

//cats

var cat = {
    count: 0,
    cost: 100,
    tipBonus: 0,
    hunger: 0,
    hungerPerSecond: 1,
    hungerText: "The cats are hungry."
}

//unlocks

var unlocked = {
    cat: 0,
    hunger: 0,
    tierOne: 0
}

//resource get functions

function coffeeClick(number) {
    resources.coffees += number
    gameTick()
}

function sellClick(number) {
    if(number > 0 && resources.coffees >= number) {
        resources.coffees -= number
        resources.money += (number * (resources.coffeePrice + cat.tipBonus * cat.count))
        gameTick()
    }
}

function fishClick(number) {
    if(number > 0 && resources.money >= number * resources.fishPrice) {
        resources.money -= (number * resources.fishPrice)
        resources.fish += number
        gameTick()
    }
}

//building buy functions

function buyBarista(number) {
    while(number > 0 && resources.money >= barista.cost) {
        resources.money -= barista.cost
        barista.count += 1
        barista.cost *= settings.costIncrease
        gameTick()
        number--
    }
}

function buyCashier(number) {
    while(number > 0 && resources.money >= cashier.cost) {
        resources.money -= cashier.cost
        cashier.count += 1
        cashier.cost *= settings.costIncrease
        gameTick()
        number--
    }
}

//cat functions

function adoptCat(number) {
    while(number > 0 && resources.money >= cat.cost) {
        resources.money -= cat.cost
        cat.count += 1
        cat.cost *= settings.costIncrease
        gameTick()
        number--
    }
}

function feedCat() {
    if(resources.fish >= cat.count && cat.hunger + resources.fishHunger <= 100) {
        resources.fish -= cat.count
        cat.hunger += resources.fishHunger
    }
    catHunger()
    gameTick()
}

//tracks cat hunger
function catHunger() {
    if(cat.hunger + resources.fishHunger > 100) {
        cat.hungerText = "The cats are full."
        cat.tipBonus = 1
        document.getElementById("catIcon").outerHTML = '<img id="catIcon" src="https://i.imgur.com/1osc4lc.png" width="120" height="150">'
    }
    else if(cat.hunger >= 30) {
        cat.hungerText = "The cats are satisfied."
        cat.tipBonus = 1
        document.getElementById("catIcon").outerHTML = '<img id="catIcon" src="https://i.imgur.com/1osc4lc.png" width="120" height="150">'
    }
    else {
        cat.hungerText = "The cats are hungry."
        cat.tipBonus = 0
        document.getElementById("catIcon").outerHTML = '<img id="catIcon" src="https://i.imgur.com/TNFTBBC.png" width="120" height="90">'
    }

    if(cat.hunger > 0) {
    cat.hunger -= (cat.hungerPerSecond / 100)
    }
    gameTick()
}

//upgrades

function upgrades(string) {
    if(string == "frenchPress" && resources.money >= 1000) {
        barista.perSecond *= 2
        resources.money -= 1000
        document.getElementById("frenchPress").style.display = "none"
    }
    if(string == "stripeCheckout" && resources.money >= 1000) {
        cashier.perSecond *= 2
        resources.money -= 1000
        document.getElementById("frenchPress").style.display = "none"
    }
}

//updates unlocked features
function unlocks() {
    if(unlocked.cat == 0 && resources.money >= 50) {
        document.getElementById("catUnlock").style.display = "block"
        unlocked.cat = 1
    }
    if(unlocked.hunger == 0 && cat.count > 0) {
        document.getElementById("hungerUnlock").style.display = "block"
        unlocked.hunger = 1
    }
    
    if(unlocked.tierOne == 0 && resources.money >= 100) {
        document.getElementById("frenchPress").style.display = "block"
        document.getElementById("stripeCheckout").style.display = "block"
        unlocked.tierOne = 1
    }
}

//updates the game ui
function gameTick() {
    document.getElementById("coffeePrice").innerHTML = "$" + resources.coffeePrice
    document.getElementById("averageTip").innerHTML = "$" + (cat.tipBonus * cat.count)
    
    document.getElementById("money").innerHTML = "$" + Math.floor(resources.money)
    document.getElementById("coffees").innerHTML = Math.floor(resources.coffees)

    document.getElementById("baristas").innerHTML = barista.count
    document.getElementById("buyBarista").innerHTML = "Hire Barista (Cost: $" + Math.ceil(barista.cost) + ")"
    if(resources.money >= barista.cost) {
        document.getElementById("buyBarista").setAttribute('class','nes-btn')
    }
    else {
        document.getElementById("buyBarista").setAttribute('class','nes-btn is-disabled')
    }
    if(resources.money >= barista.cost * 10) {
        document.getElementById("buyTenBarista").setAttribute('class','nes-btn')
    }
    else {
        document.getElementById("buyTenBarista").setAttribute('class','nes-btn is-disabled')
    }
    if(resources.money >= barista.cost * 100) {
        document.getElementById("buyHundredBarista").setAttribute('class','nes-btn')
    }
    else {
        document.getElementById("buyHundredBarista").setAttribute('class','nes-btn is-disabled')
    }

    document.getElementById("cashiers").innerHTML = cashier.count
    document.getElementById("buyCashier").innerHTML = "Hire Cashier (Cost: $" + Math.ceil(cashier.cost) + ")"
    if(resources.money >= cashier.cost) {
        document.getElementById("buyCashier").setAttribute('class', 'nes-btn')
    }
    else {
        document.getElementById("buyCashier").setAttribute('class','nes-btn is-disabled')
    }
    if(resources.money >= cashier.cost * 10) {
        document.getElementById("buyTenCashier").setAttribute('class', 'nes-btn')
    }
    else {
        document.getElementById("buyTenCashier").setAttribute('class','nes-btn is-disabled')
    }
    if(resources.money >= cashier.cost * 100) {
        document.getElementById("buyHundredCashier").setAttribute('class', 'nes-btn')
    }
    else {
        document.getElementById("buyHundredCashier").setAttribute('class','nes-btn is-disabled')
    }

    if(unlocked.cat == 1) {
        document.getElementById("cats").innerHTML = cat.count
        document.getElementById("adoptCat").innerHTML = "Adopt Cat (Cost: $" + Math.ceil(cat.cost) + ")"
        if(resources.money >= cat.cost) {
            document.getElementById("adoptCat").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("adoptCat").setAttribute('class','nes-btn is-disabled')
        }
        if(resources.money >= cat.cost * 10) {
            document.getElementById("adoptTenCat").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("adoptTenCat").setAttribute('class','nes-btn is-disabled')
        }
        if(resources.money >= cat.cost * 100) {
            document.getElementById("adoptHundredCat").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("adoptHundredCat").setAttribute('class','nes-btn is-disabled')
        }
    
    }

    if(unlocked.hunger == 1) {
        document.getElementById("catHunger").innerHTML = cat.hungerText
        document.getElementById("feedCat").innerHTML = "Feed Cats (Cost: " + cat.count + " Fish)"
        if(resources.money >= cat.count) {
            document.getElementById("feedCat").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("feedCat").setAttribute('class','nes-btn is-disabled')
        }

        document.getElementById("fish").innerHTML = resources.fish
        document.getElementById("buyFish").innerHTML = "Buy Fish (Cost: $" + resources.fishPrice + ")"
        if(resources.money >= resources.fishPrice) {
            document.getElementById("buyFish").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("buyFish").setAttribute('class','nes-btn is-disabled')
        }
        if(resources.money >= resources.fishPrice * 10) {
            document.getElementById("buyTenFish").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("buyTenFish").setAttribute('class','nes-btn is-disabled')
        }
        if(resources.money >= resources.fishPrice * 100) {
            document.getElementById("buyHundredFish").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("buyHundredFish").setAttribute('class','nes-btn is-disabled')
        }
    }

    //upgrades

    if(resources.money >= 1000) {
        document.getElementById("frenchPress").setAttribute('class','nes-btn')
    }
    else {
        document.getElementById("frenchPress").setAttribute('class','nes-btn is-disabled')
    }

    if(resources.money >= 1000) {
        document.getElementById("stripeCheckout").setAttribute('class','nes-btn')
    }
    else {
        document.getElementById("stripeCheckout").setAttribute('class','nes-btn is-disabled')
    }
    
}

//game refresh rate
window.setInterval(function() {
    coffeeClick(barista.count * barista.perSecond / 100)
    sellClick(cashier.count * cashier.perSecond / 100)
    catHunger()
    unlocks()
    gameTick()
}, 10)
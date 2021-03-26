//global game settings

var settings = {
    costIncrease: 1.15,
    costRefund: 0.5,
    update: 1
}

//resources

var resources = {
    money: 5000,
    coffees: 0,
    coffeePrice: 1,
    fish: 0,
    fishPrice: 5,
    fishHunger: 10,
    fishHealth: 10
}

//food

var food = {
    name: "Coffee",
    price: 1,
    image: "",
    ingredients: []
}

var inventory = {
    eggs: 0,
    onions: 0,
    potatoes: 0,
    meat: 0,
    essense: 0
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

//cat

var cat = {
    count: 0,
    cost: 100,
    tipBonus: 0,
    hunger: 0,
    hungerPerSecond: 1,
    hungerText: "",
    name: "The cat",

    //rpg stats
    level: 1,
    dpsMult: 5,
    dps: 5,
    health: 100,
    xp: 0
}

var monster = {
    name: "Resting",
    level: 1,
    health: 1,
    baseHealth: 1,
    dps: -1,
    image: "https://64.media.tumblr.com/tumblr_mairyt4v5J1rfjowdo1_500.gif",
    drops: []
}

//unlocks

var unlocked = {
    cat: 0,
    hunger: 0,
    tierOne: 0,
    rpgBuy: 0,
    rpg: 0
}

//capitalize first letter
function proper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//save game to localstorage
function save() {
    //savedata
    var saveData = {
        //settings
        settings: settings,

        //resources
        resources: resources,

        //buildings
        barista: barista,
        cashier: cashier,

        //cat
        cat: cat,

        //rpg
        monster: monster,
        inventory: inventory,

        //unlocks
        unlocked: unlocked
    }
    localStorage.setItem("catCafeSave", JSON.stringify(saveData))
}

//load existing save
function loadSave() {
    var savegame = JSON.parse(localStorage.getItem("catCafeSave"))
    if (savegame !== null) {
        //settings
        if (typeof savegame.settings !== undefined) {
            settings = savegame.settings
        }
        

        //resources
        if (typeof savegame.resources !== undefined) {
        resources = savegame.resources
        }

        //buildings
        if (typeof savegame.barista !== undefined) {
        barista = savegame.barista
        }
        if (typeof savegame.cashier !== undefined) {
        cashier = savegame.cashier
        }
    
        //cat
        if (typeof savegame.cat !== undefined) {
        cat = savegame.cat
        }

        //rpg
        if (typeof savegame.monster !== undefined) {
        monster = savegame.monster
        }
        if (typeof savegame.inventory !== undefined) {
            monster = savegame.inventory
        }

        //unlocks
        if (typeof savegame.unlocked !== undefined) {
            unlocked = savegame.unlocked
        }
    }
}

//delete save
function deleteSave() {
    localStorage.removeItem("catCafeSave")
}

//resource get functions

function coffeeClick(number) {
    resources.coffees += number
    gameTick()
}

function sellClick(number) {
    if(number > 0) {
        if(food.name == "Coffee") {
            resources.money += (number * (food.price + cat.tipBonus * cat.level))
        }
        else {
            var ingredientCheck = 1
            for(var i = 0; i < food.ingredients.length; i++) {
                if(inventory[food.ingredients[i]] < 1) {
                    ingredientCheck = 0
                }
            }
            if(ingredientCheck == 1) {
                for(var i = 0; i < food.ingredients.length; i++) {
                    inventory[food.ingredients[i]] -= 1
                }
                resources.money += (number * (food.price + cat.tipBonus * cat.level))
            }
        }
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

//food select function

var startup = 0

function foodSelect(number) {
    if(number == 0) {
        food.name = "Coffee"
        food.price = 1
        food.image = "https://i.imgur.com/TW6XbcN.png"
        food.ingredients.length = 0
    }
//ADD ADDITIONAL FOODS HERE
    if(number == 1) {
        food.name = "Omelette"
        food.price = 10
        food.image = "https://i.imgur.com/TW6XbcN.png"
        food.ingredients.length = 0
        food.ingredients.push("eggs")
    }
    if(number == 2) {
        food.name = "Scramble"
        food.price = 30
        food.image = "https://i.imgur.com/TW6XbcN.png"
        food.ingredients.length = 0
        food.ingredients.push("eggs")
        food.ingredients.push("onions")
    }
    if(number == 3) {
        food.name = "French Fries"
        food.price = 150
        food.image = "https://i.imgur.com/TW6XbcN.png"
        food.ingredients.length = 0
        food.ingredients.push("potatoes")
    }
    if(number == 4) {
        food.name = "Steak"
        food.price = 1000
        food.image = "https://i.imgur.com/TW6XbcN.png"
        food.ingredients.length = 0
        food.ingredients.push("meat")
    }

    //food ui update
    document.getElementById("foodPrice").innerHTML = "$" + food.price

    var ingredients = ""
    if(food.name !== "Coffee") {
        for(var i = 0; i < food.ingredients.length; i++) {
            if(i > 0) {
                ingredients += ", "
            }
            ingredients += proper(food.ingredients[i])
        }
    }
    else {
        ingredients = "None"
    }
    document.getElementById("ingredients").innerHTML = ingredients
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
    document.getElementById('nameCat').style.display = "block"
}

function nameCat() {
    cat.name = document.getElementById('catNameField').value
    document.getElementById('nameCat').style.display = "none"
    document.getElementById('catName').innerHTML = cat.name
    document.getElementById('catStats').style.display = "block"
}

function feedCat() {
    if(resources.fish >= cat.count && cat.hunger + resources.fishHunger <= 100) {
        resources.fish -= cat.count
        cat.hunger += resources.fishHunger
        
        if(cat.health + resources.fishHealth <= cat.baseHealth) {
            cat.health += resources.fishHealth
        }
        else if(cat.health < cat.baseHealth) {
            cat.health = cat.baseHealth
        }
    }
    catHunger()
    gameTick()
}

//tracks cat hunger
function catHunger() {
    if(cat.hunger + resources.fishHunger > 100) {
        cat.hungerText = cat.name + " is full."
        cat.tipBonus = 1
        document.getElementById("catIcon").outerHTML = '<img id="catIcon" src="https://i.imgur.com/1osc4lc.png" width="120" height="150">'
    }
    else if(cat.hunger >= 30) {
        cat.hungerText = cat.name + " is satisfied."
        cat.tipBonus = 1
        document.getElementById("catIcon").outerHTML = '<img id="catIcon" src="https://i.imgur.com/1osc4lc.png" width="120" height="150">'
    }
    else {
        cat.hungerText = cat.name + " is hungry."
        cat.tipBonus = 0
        document.getElementById("catIcon").outerHTML = '<img id="catIcon" src="https://i.imgur.com/TNFTBBC.png" width="120" height="90">'
    }

    if(cat.hunger > 0) {
    cat.hunger -= (cat.hungerPerSecond / 100)
    }
    gameTick()
}

//rpg

function monsterSelect(number) {
    if(number == 0) {
        monster.name = "Resting"
        monster.level = 0,
        monster.health = 1
        monster.baseHealth = 1
        monster.dps = -1
        monster.image = "https://64.media.tumblr.com/tumblr_mairyt4v5J1rfjowdo1_500.gif"
        monster.drops.length = 0
    }
//ADD ADDITIONAL MONSTERS HERE
    if(number == 1) {
        monster.name = "Eggdog"
        monster.level = 1
        monster.health = 50
        monster.baseHealth = 50
        monster.dps = 1
        monster.image = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/16b36037-0122-4e7e-98c9-2f23fce5ec48/ddonnuq-241dd4b8-e95f-48c9-bf21-61353a46bc07.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTZiMzYwMzctMDEyMi00ZTdlLTk4YzktMmYyM2ZjZTVlYzQ4XC9kZG9ubnVxLTI0MWRkNGI4LWU5NWYtNDhjOS1iZjIxLTYxMzUzYTQ2YmMwNy5naWYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.lkTCFLSU2lLMgEEJPNnnTNN9Go9QHOrMpRiKLw6YUcg"
        monster.drops.length = 0
        monster.drops.push("eggs")
    }
    if(number == 2) {
        monster.name = "Onyon"
        monster.level = 5
        monster.health = 300
        monster.baseHealth = 300
        monster.dps = 6
        monster.image = "https://i2.wp.com/oniongames.jp/onion_wp/wp-content/uploads/2014/02/onionblog0219.gif?ssl=1"
        monster.drops.length = 0
        monster.drops.push("onions")
    }
    if(number == 3) {
        monster.name = "Tato"
        monster.level = 15
        monster.health = 750
        monster.baseHealth = 750
        monster.dps = 15
        monster.image = "https://64.media.tumblr.com/5dc5944477d4815685c1c93f7dbc47cb/tumblr_n2bewhurSE1sr05r6o1_500.gif"
        monster.drops.length = 0
        monster.drops.push("potatoes")
    }
    if(number == 4) {
        monster.name = "Pig God"
        monster.level = 75
        monster.health = 4800
        monster.baseHealth = 4800
        monster.dps = 70
        monster.image = "https://i.giphy.com/media/jy7mx8ZRjnDcnZZSd7/giphy.webp"
        monster.drops.length = 0
        monster.drops.push("meat")
        monster.drops.push("essence")
    }

    //update ui
    document.getElementById("monsterName").innerHTML = monster.name
    document.getElementById("monsterImage").src = monster.image
    if(number == 0) {
        document.getElementById("monsterLevel").style.display = "none"
        document.getElementById("monsterHealthBar").style.display = "none"
        document.getElementById("monsterDropsContainer").style.display = "none"
    }
    else {
        document.getElementById("monsterLevel").style.display = "table-row"
        document.getElementById("monsterHealthBar").style.display = "table-row"
        document.getElementById("monsterDropsContainer").style.display = "table-cell"
        document.getElementById("monsterLevel").innerHTML = "Level " + monster.level
        
        var drops = ""
        for(var i = 0; i < monster.drops.length; i++) {
            if(i > 0) {
                drops += "<br>"
            }
            drops += proper(monster.drops[i])
        }

        document.getElementById("monsterDrops").innerHTML = drops
    }
}

function combat(number) {
    if(unlocked.rpg == 1) {
        if(monster.name !== "Resting") {
            monster.health -= (cat.dps / number)
        }
        if(cat.health - monster.dps / number <= cat.baseHealth) {
            cat.health -= (monster.dps / number)
        }
        if(monster.health <= 0) {
            monster.health = monster.baseHealth
            cat.xp += monster.level
            if (cat.xp >= cat.level * 10) {
                cat.xp = 0
                cat.level += 1
                cat.dps = cat.dpsMult * cat.level
            }
            var drop = monster.drops[Math.floor(Math.random() * monster.drops.length)]
            inventory[drop] += 1
        }
        if(cat.health <= 0) {
            cat.health = 0
            monsterSelect(0)
            document.getElementById("monsterSelect").value = "0"
        }
    }
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
        document.getElementById("stripeCheckout").style.display = "none"
    }
    if(string == "outsideCat" && resources.money >= 3000) {
        unlocked.rpg = 1
        resources.money -= 3000
        monsterSelect(0)
        document.getElementById("monsterSelect").value = "0"
        document.getElementById("outsideCat").style.display = "none"
        document.getElementById("rpgUnlock").style.display = "block"
        document.getElementById("rpgStats").style.display = "block"
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
        document.getElementById("coffeeUpgrades").style.display = "block"
        document.getElementById("frenchPress").style.display = "block"
        document.getElementById("stripeCheckout").style.display = "block"
        unlocked.tierOne = 1
    }

    if(cat.count > 0) {
        document.getElementById("adoptCat").style.display = "none"
    }

    if(unlocked.hunger == 1 && unlocked.rpgBuy == 0 && resources.money >= 1500) {
        document.getElementById("catUpgrades").style.display = "block"
        document.getElementById("outsideCat").style.display = "block"
        unlocked.rpgBuy = 1
    }
}

//updates the game ui
function gameTick() {
    
    //update coffee price and tip bonus
    
    document.getElementById("coffeePrice").innerHTML = "$" + resources.coffeePrice
    if(cat.count > 0) {
        document.getElementById("averageTip").innerHTML = "$" + (cat.tipBonus * cat.level)
    }
    
    //update coffee and money amount

    document.getElementById("money").innerHTML = "$" + Math.floor(resources.money)
    document.getElementById("coffees").innerHTML = Math.floor(resources.coffees)

    //set food to coffee on startup
    if(startup == 0) {
        document.getElementById("foodSelect").value = "0"
        startup = 1
    }

    //disable purchase buttons when too expensive

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

    if(unlocked.cat == 1 && cat.count == 0) {
        if(resources.money >= cat.cost) {
            document.getElementById("adoptCat").setAttribute('class','nes-btn')
        }
        else {
            document.getElementById("adoptCat").setAttribute('class','nes-btn is-disabled')
        }   
    }

    //hunger ui update

    if(unlocked.hunger == 1) {
        document.getElementById("catHunger").innerHTML = cat.hungerText
        document.getElementById("feedCat").innerHTML = "Feed (Cost: " + cat.count + " Fish)"
        if(resources.fish >= cat.count && cat.hunger + resources.fishHunger < 100) {
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

    //rpg ui update

    if(unlocked.rpg == 1) {
        document.getElementById("catLevel").innerHTML = "Level " + cat.level

        document.getElementById("catXp").setAttribute('value', cat.xp * 10 / cat.level)
        document.getElementById("catXpText").innerHTML = cat.xp + "/" + cat.level * 10

        document.getElementById("catHealth").setAttribute('value', cat.health / cat.level)
        document.getElementById("catHealthText").innerHTML = cat.health + "/" + cat.level * 100

        document.getElementById("catDps").innerHTML = "DPS: " + cat.dps

        document.getElementById("monsterHealth").setAttribute('value', monster.health / monster.baseHealth * 100)
        document.getElementById("monsterHealthText").innerHTML = monster.health + "/" + monster.baseHealth
    }

    //inventory ui update
    document.getElementById("eggs").innerHTML = inventory.eggs
    document.getElementById("onions").innerHTML = inventory.onions
    document.getElementById("potatoes").innerHTML = inventory.potatoes
    document.getElementById("meat").innerHTML = inventory.meat

    //upgrades ui update

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

    if(resources.money >= 3000) {
        document.getElementById("outsideCat").setAttribute('class','nes-btn')
    }
    else {
        document.getElementById("outsideCat").setAttribute('class','nes-btn is-disabled')
    }
    
}

//game refresh rate
window.setInterval(function() {
    coffeeClick(barista.count * barista.perSecond / 50)
    sellClick(cashier.count * cashier.perSecond / 50)
    catHunger()
    unlocks()
    gameTick()
}, 20)

//combat loop
window.setInterval(function() {
    combat(1)
    gameTick()
}, 1000)

//save loop
window.setInterval(function() {
    save()
}, 10000)
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const funlist = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cow-on_pole%2C_with_antlers.jpeg/220px-Cow-on_pole%2C_with_antlers.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Vancouver_Folly_coal_harbour.jpg/150px-Vancouver_Folly_coal_harbour.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Sealand_fortress.jpg/150px-Sealand_fortress.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Sedlec-Ossuary.jpg/150px-Sedlec-Ossuary.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/The_Shitterton_Sign.jpg/150px-The_Shitterton_Sign.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Unst_Bus_Shelter.jpg/150px-Unst_Bus_Shelter.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Len%C3%A7%C3%B3is_Maranhenses_2018.jpg/150px-Len%C3%A7%C3%B3is_Maranhenses_2018.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Florence-yall.jpg/150px-Florence-yall.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Thousand_Islands_single_house.jpg/150px-Thousand_Islands_single_house.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mill_Ends_Park.jpg/150px-Mill_Ends_Park.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Baldwinstreet.jpg/150px-Baldwinstreet.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Complaint_tablet_to_Ea-Nasir_2023.JPG/150px-Complaint_tablet_to_Ea-Nasir_2023.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Prager_Fenstersturz_Wahrhafftige_Zeitung_aus_Prag.JPG/150px-Prager_Fenstersturz_Wahrhafftige_Zeitung_aus_Prag.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Chocolate_Pi_Pie%2C_March_2010.jpg/150px-Chocolate_Pi_Pie%2C_March_2010.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tastatur-Umlaute-deutsch.jpg/150px-Tastatur-Umlaute-deutsch.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Elon_Musk%27s_Tesla_Roadster_%2840110297852%29.jpg/150px-Elon_Musk%27s_Tesla_Roadster_%2840110297852%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Mimas_Cassini.jpg/150px-Mimas_Cassini.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Satellites_For_Sale_-_GPN-2000-001036.jpg/150px-Satellites_For_Sale_-_GPN-2000-001036.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Brightcontrast.jpg/150px-Brightcontrast.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Bundesarchiv_Bild_183-R01996%2C_Brieftaube_mit_Fotokamera_cropped.jpg/150px-Bundesarchiv_Bild_183-R01996%2C_Brieftaube_mit_Fotokamera_cropped.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/JapaneseToiletBidet.jpg/150px-JapaneseToiletBidet.jpg",
];

async function onsubmit2() {
    //event.preventDefault();
    let ip = $("#ip_field").val();
    if (ip == "" || ip == null) {
        alert("the ip is blank!");
        return;
    }
    let response = await fetch("https://api.mcsrvstat.us/3/" + ip);
    let data = await response.json().then((data) => data = data);
    $("#container").empty();
    if (document.querySelector("#raw_data_field").checked) {
        console.log(data);
        $("#container").append(
            `<li><pre>${JSON.stringify(data, null, 4)}</pre></li>`,
        );
        document.cookie = `lastserverip=${ip}`;
        return;
    }
    if (data.online && data.players.max > 0) {
        $("#container").append(`<li><h3 style="color: green">online</h3></li>`);
        $("#container").append(
            `<li><p>resolved ip: <code>${data.ip}:${data.port}</code></p></li>`,
        );
        $("#container").append(
            `<li><p>message of the day: <span style="background-color: darkgray">${
                data.motd.html.join("  ")
            }</span></p></li>`,
        );
        if (data.icon) {
            $("#container").append(
                `<li><p>server icon: <a href="${data.icon}" target="_blank"><img src="${data.icon}"></a></p></li>`,
            );
        }
        $("#container").append(
            `<li><p>player count: <b>${data.players.online}</b> out of <b>${data.players.max}</b></p></li>`,
        );
        if (data.players.list.length > 0) {
            $("#container").append(`<li><p id="plist">players: </p></li>`);
            let plist = data.players.list;
            for (let player in plist) {
                $("#plist").append(
                    `<a href="https://namemc.com/profile/${plist[player].uuid}">
                <img src="https://crafthead.net/helm/${
                        plist[player].uuid
                    }" height=16>${plist[player].name}</a>,`,
                );
            }
        } else {$("#container").append(
                `<li><p id="plist">no one is online</p></li>`,
            );}
        $("#container").append(
            `<li><p>minecraft version (might contain other info): <code>${data.version}</code></p></li>`,
        );
    } else {
        $("#container").append(`<li><h3 style="color: red">offline</h3></li>`);
        $("#container").append(
            `<li>feeling down, like your server? have an unusual Wikipedia image<br><img src="${
                funlist[Math.floor(Math.random() * funlist.length + 1)]
            }"></li>`,
        );
    }
    let e = new Date(); e.setMonth(new Date().getMonth() + 12);
    console.log(e.toUTCString());
    document.cookie = `lastserverip=${ip}; expires=${e.toUTCString()}`;
    return;
}

window.addEventListener("load", function () {
    $("#ip_field").val(getCookie("lastserverip"));
});

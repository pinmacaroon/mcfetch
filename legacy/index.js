// /// <reference types="jquery" />
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


async function onsubmit2() {
    //event.preventDefault();
    $("#loadingspinner").show();
    let ip = $("#ip_field").val();
    if (ip == "" || ip == null) {
        $("#loadingspinner").hide();
        alert("the ip is blank!");
        return;
    }
    let response = await fetch("https://api.mcsrvstat.us/3/" + ip);
    let data = await response.json().then((data) => data = data);
    if (document.querySelector("#raw_data_field").checked) {
        console.log(data);
        
        $("#container").append(
            `
        <li>
            <div class="server_slot">
                <a href="javascript:void(0)" onclick="$(this).parent().parent().remove()">[remove]</a><br><br>
                <textarea readonly width="128" height="128">${JSON.stringify(data, null, 4)}</textarea>
            </div>
        </li>`,
        );
        document.cookie = `lastserverip=${ip}`;
        
        $("#loadingspinner").hide();
        return;
    }
    if (data.online) {
        let server_icon;
        if(data.icon){
            server_icon = data.icon;
        } else {
            server_icon = packpng;
        }

        let plist = "";
        if (data.players.list) {
            let players = data.players.list;
            for (let p in players) {
                let player = players[p];
                plist += `<a href="https://namemc.com/profile/${player.uuid}"><img src="https://crafthead.net/helm/${player.uuid}" height=16>${player.name}</a>,`;
            }
            if (data.players.online - data.players.list.length > 0) {
                plist += ` and ${data.players.online - data.players.list.length} anonymous player`;
                if (data.players.online - data.players.list.length > 1){
                    plist += "s";
                }
            }
        } else {
            plist = "unknown";
        }

        $("#container").append(`
        <li>
            <div class="server_slot">
                <a class="server_icon" href="${server_icon}" target="_blank">
                    <img src="${server_icon}" height="128" width="128">
                </a>
                <span>
                    <span class="server_name">${ip}</span>
                    <a href="javascript:void(0)" onclick="$(this).parent().parent().parent().remove()">[remove]</a><br><br>
                    <span class="server_motd">${data.motd.clean.join("<br>")}</span><br><br>
                    <span class="server_players">players: ${plist}</span><br><br>
                    <span class="">${new Date(data.debug.cachetime*1000).toString()}</span>
                </span>
                <span class="server_status"><code>${data.players.online}/${data.players.max}</code></span>
            </div>
        </li>
        `);
    } else {
        $("#container").append(`
        <li>
            <div class="server_slot">
                <a class="server_icon" href="${packpng}" target="_blank">
                    <img src="${packpng}" height="128" width="128">
                </a>
                <span>
                    <span class="server_name">${ip}</span>
                    <a href="javascript:void(0)" onclick="$(this).parent().parent().parent().remove()">[remove]</a><br><br>
                    <span class="server_motd">offline</span><br><br>
                    <span class="server_players"></span><br><br>
                    <span class="">${new Date().toString()}</span>
                </span>
                <span class="server_status"><code>0/0</code></span>
            </div>
        </li>
        `);
    }
    let e = new Date(); e.setMonth(new Date().getMonth() + 12);
    document.cookie = `lastserverip=${ip}; expires=${e.toUTCString()}`;
    $("#loadingspinner").hide();
    return;
}

window.addEventListener("load", async function () {
    $("#ip_field").val(getCookie("lastserverip"));
    if(getCookie("theme") == "light"){
        $('link#stylesheet').attr('href', 'light.css');
        $('a#light_button').hide();
        $('a#dark_button').show();
    } else if (getCookie("theme") == "dark"){
        $('link#stylesheet').attr('href', 'dark.css');
        $('a#dark_button').hide();
        $('a#light_button').show();
    }
    //https://api.github.com/repos/pinmacaroon/mcfetch/commits
    let response = await fetch("https://api.github.com/repos/pinmacaroon/mcfetch/commits");
    let data = await response.json().then((data) => data = data);
    $("span#version_span").html(data[0].sha.slice(0,7) + " by " + data[0].commit.author.name + " at " + new Date(data[0].commit.author.date).toString() +": " + data[0].commit.message);
    $("#loadingspinner").hide();
});

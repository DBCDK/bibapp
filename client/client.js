// Copyright 2012 Rasmus Erik
/*global document:true*/
(function() {
    "use strict";
    // Util {{{1
    function jmlToDom(jml) { //{{{
        if(Array.isArray(jml)) {
            var children;
            var classes = jml[0].split(".");
            var name = classes[0];
            classes = classes.slice(1);
            var attr = jml[1];
            var pos = 1;
            if(typeof attr === "object" && attr.constructor === Object) {
                ++pos;
                attr = attr;
            } else {
                attr = {};
            }
            if(classes.length) {
                attr["class"] = classes.join(" ");
            }
            var elem = document.createElement(name);
            for(var prop in attr) {
                elem.setAttribute(prop, attr[prop]);
            }
            while(pos < jml.length) {
                elem.appendChild(jmlToDom(jml[pos]));
                ++pos;
            }
            return elem;
        } else {
            return document.createTextNode(jml);
        }
    } //}}}
    function applyStyle(domNode, style) {//{{{
        var styleObj = domNode.style;
        for(var prop in style) {
            var val = style[prop];
            if(typeof val === "number") {
                val = val + "px";
            }
            styleObj[prop] = val;
        }
    }//}}}
    function domRecursiveApply(domNode, table) { //{{{
        var classes = domNode.classList;
        for(var i = 0; i < classes.length; ++i) {
            var entry = table[classes[i]];

            if(typeof entry === "object") {
                applyStyle(domNode, entry);
            } else if(typeof entry === "function") {
                entry(domNode);
            }
        }

        var children = domNode.children;
        for(i=0; i<children.length; ++i) {
            domRecursiveApply(children[i], table);
        }
    } //}}}
    // Model {{{1
    (function() {
        var content = {
            lastSync: 1356706097976,
            calendar: [{
                date: 1356706097976,
                title: "Glædeligt nytår",
                description: "starten af en artikel ....",
                url: "http://bibilitek.kk.dk/foo/bar...html",
                thumbUrl: "http://bibliotek.kk.dk/foo/bar...jpg"}],
            news: [{
                date: 1356706097976,
                title: "Nytårskursus",
                description: "Kursus om ...",
                url: "http://bibilitek.kk.dk/foo/bar...html",
                thumbUrl: "http://bibliotek.kk.dk/foo/bar...jpg"}]};
        var cache = {
            materials: {
                "830318:48781321": {
                    lastSync: 1356706097976,
                    id: "830318:48781321",
                    title: "Samlede Eventyr",
                    creator: "H. C. Andersen",
                    type: "book",
                    thumbUrl: "http://bibliotek.kk.dk/foo/bar...",
                    description: "Samling af eventyr der ... og så også ... blah blah blah blah blah...",
                    topic: ["dk5:89.13", "eventyr"],
                    isbn: "891384328401",
                    status: "available",
                }},
            searches: {
                "sample search string": {
                    id: "sample search string",
                    lastSync: 1356706097976,
                    resultCount: 1324,
                    resultsLoaded: 20,
                    results: [{
                        id: "830318:48781321",
                        title: "Samlede Eventyr",
                        creator: "H. C. Andersen",
                        type: "book",
                        thumbUrl: "http://bibliotek.kk.dk/foo/bar...",
                        description: "Samling af eventyr der ... og så også ... blah blah blah blah blah...",
                        status: "available"}]} }};
        var patronInfo = {
            lastSync: Date.now(),
            name: "Joe User",
            loans: {
                "830318:48781321": {
                    expireDate: 1356706097976,
                    id: "830318:48781321",
                    title: "Some title",
                    author: "Some author",
                    // set renewRequest if we have requested a renew
                    renewRequest: true }},
            reservations: {
                "830318:48781321": {
                    expireDate: 1356706097976,
                    reservationDate: 1356706097976,
                    id: "830318:48781321",
                    title: "Some title",
                    author: "Some author",
                    // set deleteRequest if we want to delete the reservation
                    deleteRequest: true,
                    // info about arrival if arrived
                    arrived: "7/1 32 Husum"} }};
    })();
    // Views {{{1
    function genStyles() { //{{{
        var width = 240;
        var height = 320;
        var margin = (width / 40) & ~1;
        var unit = ((width - 7 * margin)/6) | 0;
        var margin0 = (width - 7 * margin - unit * 6) >> 1;
        var smallFont = unit * .4;
        function wn(n) { //{{{
            return {
                verticalAlign: "middle",
                border: "none",
                padding: 0,
                marginLeft: margin,
                marginRight: 0,
                width: unit * n + margin * (n-1),
                display: "inline-block",
                boxShadow: "1px 1px 4px rgba(0,0,0,1)",
            };
        } //}}}
        var result = { //{{{
            line: {
                marginTop: margin,
                //textAlign: "center",
                height: unit,
            },
            content: {
                position: "relative",
                top: unit+margin,
                left: 0,
                width: width,
            },
            page: {
                //position: "relative",
                verticalAlign: "middle",
                //overflow: "hidden",
                lineHeight: "100%",
                fontSize: smallFont,
                fontFamily: "sans-serif",
                border: "1px solid black",
                margin: unit/2,
                padding: 0,
                display: "inline-block",
                width: width,
                height: height,
                background: "white",
            },
            header: {
                position: "fixed",
                height: unit+margin, width: width,
                background: "rgba(255,255,255,.7)",
            },
            largeWidget: {
                marginTop: margin,
                height: (height - unit * 3 - margin * 6) >>1,
                marginLeft: margin,
                marginRight: margin,
                overflow: "hidden",
                boxShadow: "1px 1px 4px rgba(0,0,0,1)",
            },
            resultImg: {
                float: "left",
                height: 1.618 * unit,
                width: unit,
                marginRight: margin,
                marginBottom: margin,
            },
            resultOrderButton: {
                float: "right",
                height: unit,
            },
            searchResult: {
                marginTop: margin,
                height: 1.618 * unit,
                overflow: "hidden",
            },
            headerPadding: { height: unit+margin },
            w1: wn(1), w2: wn(2), w3: wn(3),
            w4: wn(4), w5: wn(5), w6: wn(6),
        } //}}}
        return result;
    } //}}}
    var jml = ["div",  //{{{
            ["div.page.frontPage", //{{{
                ["div.biblogo.w6.line", "Kardemommeby bibliotek"],
                ["div.patronWidget.w4.line", "Lånerstatus: Afl.&nbsp;12/1. Lån:&nbsp;7, Hjemkomne:&nbsp;3."],
                ["div.openingTime.w2.line", "Åbningstider"],
                ["input.searchLine.w5.line", {value: "foo"}],
                ["div.searchButton.w1.line", "søg"],
                ["div.largeWidget.newsWidget", 
                    ["div.widgetTitle", "News"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"]],
                ["div.largeWidget.calendarWidget", 
                    ["div.widgetTitle", "Kalender"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"],
                    ["div.widgetItem", ["span.widgetDate", "29/12"], "some item text"]]], //}}}
            ["div.page.patronInfo", //{{{
                ["div.header", 
                    ["span.backButton.w1.line", "back"],
                    ["span.patronStatus.w4.line", "Logget ind som Joe User", ["br"], "Opdateret i dag 15:31"],
                    ["span.logoutButton.w1.line", "log ud"]],
                ["div.content",
                    ["div.w6.patronHeading", "Hjemkomne reserveringer"],
                    ["div",
                        ["span.w2.line", "3/1 #42", ["br"], "husum"], 
                        ["span.w4.spacing.bookentry.line", "Tusinde og en nat...", ["br"], "Scherazade"]],
                    ["div.w6.patronHeading", "Hjemlån"],
                    ["div",
                        ["span.w1.date.line", "5/2"], 
                        ["span.w4.bookentry.line", "Tusinde og en nat...", ["br"], "Scherazade"], 
                        ["div.w1.renewAll.line", "Forny"]],
                    ["div",
                        ["span.w1.date.line", "5/2"], 
                        ["span.w4.bookentry.line", "Tusinde og en nat...", ["br"], "Scherazade"], 
                        ["div.w1.renewAll.line", "Forny"]],
                    ["div.w6.patronHeading", "Reserveringer"],
                    ["div",
                        ["span.w1.line", "3/1"], 
                        ["span.w4.bookentry.line", "Folkeeventyr", ["br"], "Brødrene Grimm"], 
                        ["div.w1.renewAll.line", "slet"]],
                    ["div",
                        ["span.w1.line", "3/1"], 
                        ["span.w4.bookentry.line", "Folkeeventyr", ["br"], "Brødrene Grimm"], 
                        ["div.w1.renewAll.line", "slet"]],
                    ["div",
                        ["span.w1.line", "3/1"], 
                        ["span.w4.bookentry.line", "Folkeeventyr", ["br"], "Brødrene Grimm"], 
                        ["div.w1.renewAll.line", "slet"]]]], //}}}
            ["div.page.searchResults", //{{{
                ["div.header", 
                    ["span.backButton.w1.line", "back"],
                    ["textarea.searchBox.w4.line", "searchquery"],
                    ["span.logoutButton.w1.line", "log ud"]],
                ["div.content", //{{{
                    ["div.searchResult.w6",
                        ["img.wn1.resultImg", {src: "borked"}],
                        ["div.resultOrderButton.w1", "Bestil"],
                        ["div.resultTitle", "Der var engang..."],
                        ["div.resultCreator", "H. C. Andersen"],
                        ["div.resultDescription", "Eventyr blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"]],
                    ["div.searchResult.w6",
                        ["img.wn1.resultImg", {src: "borked"}],
                        ["div.resultOrderButton.w1", "Bestil"],
                        ["div.resultTitle", "Der var engang..."],
                        ["div.resultCreator", "H. C. Andersen"],
                        ["div.resultDescription", "Eventyr blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"]],
                    ["div.searchResult.w6",
                        ["img.wn1.resultImg", {src: "borked"}],
                        ["div.resultOrderButton.w1", "Bestil"],
                        ["div.resultTitle", "Der var engang..."],
                        ["div.resultCreator", "H. C. Andersen"],
                        ["div.resultDescription", "Eventyr blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"]],
                    ["div.searchResult.w6",
                        ["img.wn1.resultImg", {src: "borked"}],
                        ["div.resultOrderButton.w1", "Bestil"],
                        ["div.resultTitle", "Der var engang..."],
                        ["div.resultCreator", "H. C. Andersen"],
                        ["div.resultDescription", "Eventyr blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"]],
                    ["div.searchResult.w6",
                        ["img.wn1.resultImg", {src: "borked"}],
                        ["div.resultOrderButton.w1", "Bestil"],
                        ["div.resultTitle", "Der var engang..."],
                        ["div.resultCreator", "H. C. Andersen"],
                        ["div.resultDescription", "Eventyr blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah"]]],//}}}
            ], //}}}
            ["div.page.login", //{{{
                ["span.w6.spacing.largeWidget", ""],
                ["div.w2.right", "Login:"],
                ["input.w4.line", ""],
                ["div.w2.right", "Kode:"],
                ["input.w4.line", {type: "password"}, ""],
                ["span.w2.spacing", ""],
                ["div.w2.line.button", "Annuller"],
                ["div.w2.line.button", "Login"],
                ["span.w6.spacing.largeWidget", ""],
            ], //}}}
    ]; //}}}
    // Control {{{1
    // Test {{{1
    var dom = jmlToDom(jml);
    document.body.appendChild(dom);
    domRecursiveApply(dom, genStyles());
    console.log(jmlToDom("foo bar baz").constructor);
})();
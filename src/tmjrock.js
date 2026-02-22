function $$$(cid) {
    let element = document.getElementById(cid);
    if (!element) throw "Invalid id : " + cid;
    return new TMJRockElement(element);
}

$$$.model = {
    "onStartup": [],
    "accordians": [],
    "modals": []
};
//
//modal specific code starts here
$$$.modals = {};
$$$.modals.show = function (mid) {
    var modal = null;
    for (var i = 0; i < $$$.model.modals.length; i++) {
        if ($$$.model.modals[i].getContentId() == mid) {
            modal = $$$.model.modals[i];
            break;
        }
    }
    if (modal == null) return;
    modal.show();
};
//following is a class
function Modal(cref) {
    var objectAddress = this;
    this.afterOpening = null;
    this.beforeOpening = null;
    this.beforeClosing = null;
    this.afterClosing = null;
    var contentReference = cref;
    this.getContentId = function () {
        return contentReference.id;
    };
    var contentParentReference = contentReference.parentElement;
    var contentIndex = 0;
    while (contentIndex < contentParentReference.children.length) {
        if (contentReference == contentParentReference.children[contentIndex]) {
            break;
        }
        contentIndex++;
    }
    var modalMaskDivision = document.createElement('div');
    modalMaskDivision.style.display = 'none';
    modalMaskDivision.classList.add('tmjrock_modalMask');
    var modalDivision = document.createElement('div');
    modalDivision.style.display = 'none';// reason ....
    modalDivision.classList.add('tmjrock_modal');
    document.body.appendChild(modalMaskDivision);
    document.body.appendChild(modalDivision);
    // even if user didn't specify header or footer but we will still put a division for both

    var headerDivision = document.createElement('div');
    headerDivision.classList.add('tmjrock_modalHeader');
    //headerDivision.style.background='red';// only for testing remove in the library
    headerDivision.style.right = '0';
    headerDivision.style.height = '40px';
    headerDivision.style.padding = '5px';
    modalDivision.appendChild(headerDivision);

    //parse and set the width and height of the modal division


    var contentDivision = document.createElement('div');
    contentDivision.style.border = "1px solid black";
    // determining the height of contentDivision by subtracting the total height of modal division from header and footer height's


    var contentDivisionHeight;
    var contentDivisionWidth;
    if (contentReference.hasAttribute('size')) {
        var sz = contentReference.getAttribute('size');
        let xpos = sz.indexOf("x");
        if (xpos == -1) xpos = indexOf("X");
        if (xpos == -1) throw "In case of modal size should be specified as widthxheight";
        if (xpos == 0 || xpos + 1 == sz.length) throw "In case of modal size should be specified as widthxheight";
        let width = sz.substring(0, xpos); //if xpos is 4 it will take from 0 to 3 index
        let height = sz.substring(xpos + 1);
        contentDivisionWidth = parseInt(width);
        contentDivisionHeight = parseInt(height);
        contentDivision.style.width = width + "px";
        contentDivision.style.height = height + "px";
    }
    else {
        //setting default size
        contentDivision.style.width = '300px';
        contentDivision.style.height = '300px';
        contentDivisionWidth = 300;
        contentDivisionHeight = 300;
    }

    var modalDivisionHeight = 300;
    var modalDivisionWidth = 400;

    modalDivision.style.height = (contentDivisionHeight + 110) + "px";
    if (modalDivisionWidth < contentDivisionWidth) {
        modalDivision.style.width = (contentDivisionWidth) + "px";
    }
    //contentDivision.style.height=(contentDivision.style.height.substring(0,contentDivision.style.height.length-2)-130)+"px";
    contentDivision.style.width = "98%";
    contentDivision.style.overflow = "auto";
    contentDivision.style.padding = "5px";
    contentReference.remove();
    contentDivision.appendChild(contentReference);
    contentReference.style.display = 'block';
    contentReference.style.visibility = 'visible';
    modalDivision.appendChild(contentDivision);


    if (contentReference.hasAttribute('header')) {
        var hd = contentReference.getAttribute('header');
        headerDivision.innerHTML = hd;
    }
    if (contentReference.hasAttribute('maskColor')) {
        var mkc = contentReference.getAttribute('maskColor');
        modalMaskDivision.style.background = mkc;
    }
    if (contentReference.hasAttribute('modalBackgroundColor')) {
        var mbc = contentReference.getAttribute('modalBackgroundColor');
        modalDivision.style.background = mbc;
    }

    var footerDivision = document.createElement('div');
    //footerDivision.style.background='pink';
    footerDivision.classList.add('tmjrock_modalFooter');
    footerDivision.style.left = '0'; // trick for right placing of all division
    footerDivision.style.right = '0'; // same.....
    footerDivision.style.height = '40px';
    footerDivision.style.position = 'absolute';// trick to place it on bottom
    footerDivision.style.bottom = '0'; // same trick...
    footerDivision.style.padding = '5px';
    modalDivision.appendChild(footerDivision);

    if (contentReference.hasAttribute('footer')) {
        var ft = contentReference.getAttribute('footer');
        footerDivision.innerHTML = ft;
    }
    var closeButtonSpan = null;
    if (contentReference.hasAttribute('closeButton')) {
        var cb = contentReference.getAttribute('closeButton');
        if (cb.toUpperCase() == 'TRUE') {
            closeButtonSpan = document.createElement('span');
            closeButtonSpan.classList.add('tmjrock_closeButton');
            /*
            var closeButtonMarker=document.createTextNode('x');
            closeButtonSpan.appendChild(closeButtonMarker);
            */
            var closeButtonImg = document.createElement('img');
            closeButtonImg.src = "../img/close.png";
            closeButtonImg.alt = 'x';
            closeButtonSpan.appendChild(closeButtonImg);
            headerDivision.appendChild(closeButtonSpan);
        }

    }
    if (contentReference.hasAttribute('beforeOpening')) {
        var bo = contentReference.getAttribute('beforeOpening');
        this.beforeOpening = bo;
    }

    if (contentReference.hasAttribute('afterOpening')) {
        var ao = contentReference.getAttribute('afterOpening');
        this.afterOpening = ao;
    }
    if (contentReference.hasAttribute('beforeClosing')) {
        var bc = contentReference.getAttribute('beforeClosing');
        this.beforeClosing = bc;
    }

    if (contentReference.hasAttribute('afterClosing')) {
        var ac = contentReference.getAttribute('afterClosing');
        this.afterClosing = ac;
    }


    this.show = function () {
        let openModal = true;
        if (this.beforeOpening) {
            openModal = eval(this.beforeOpening);// we're passing a string to eval, eval will evaluate the string and found it's a function then it calls the function and whatever the function will return eval will also returns that 
        }
        if (openModal) {
            modalMaskDivision.style.display = 'block';
            modalDivision.style.display = 'block'; // same...
            if (this.afterOpening) setTimeout(function () { eval(objectAddress.afterOpening); }, 100);
        }
    };

    if (closeButtonSpan != null) {
        closeButtonSpan.onclick = function () {
            let closeModal = true;
            if (objectAddress.beforeClosing) {
                closeModal = eval(objectAddress.beforeClosing);
            }
            if (closeModal) {
                modalMaskDivision.style.display = 'none';
                modalDivision.style.display = 'none';
                if (objectAddress.afterClosing) setTimeout(function () { eval(objectAddress.afterClosing); }, 100);
            }
        };
    }
}



//modal specific code ends here
// accordian specific code starts here
$$$.accordianHeadingClicked = function (accordianIndex, panelIndex) {
    let accord = $$$.model.accordians[accordianIndex];
    if (accord.expandedIndex != -1) accord.panels[accord.expandedIndex].style.display = 'none';
    accord.panels[panelIndex + 1].style.display = accord.panels[panelIndex + 1].oldDisplay;
    accord.expandedIndex = panelIndex + 1;
};


$$$.toAccordian = function (accord) {
    let panels = [];
    let expandedIndex = -1;
    let children = accord.childNodes;
    let x;
    for (x = 0; x < children.length; x++) {
        if (children[x].nodeName == 'H1' || children[x].nodeName == 'H2' || children[x].nodeName == 'H3' || children[x].nodeName == 'H4' || children[x].nodeName == 'H5' || children[x].nodeName == 'H6') {
            panels[panels.length] = children[x];
        }
        if (children[x].nodeName == 'DIV') panels[panels.length] = children[x];
    }

    if (panels.length % 2 != 0) throw 'Heading and division malformed to create accordian';
    for (x = 0; x < panels.length; x += 2) {
        if (panels[x].nodeName != 'H1' && panels[x].nodeName != 'H2' && panels[x].nodeName != 'H3' && panels[x].nodeName != 'H4' && panels[x].nodeName != 'H5' && panels[x].nodeName != 'H6') throw 'Heading and division malformed to create accordian';
        if (panels[x + 1].nodeName != 'DIV') throw 'Heading and division malformed to create accordian';
    }
    function createClickHandler(accordianIndex, panelIndex) {
        return function () {
            $$$.accordianHeadingClicked(accordianIndex, panelIndex);
        };
    }
    let accordianIndex = $$$.model.accordians.length;
    for (x = 0; x < panels.length; x += 2) {
        panels[x].onclick = createClickHandler(accordianIndex, x);
        panels[x + 1].oldDisplay = panels[x + 1].style.display;
        panels[x + 1].style.display = 'none';
    }
    $$$.model.accordians[accordianIndex] = {
        "panels": panels,
        "expandedIndex": -1
    };
};

$$$.onDocumentLoaded = function (func) {
    if ((typeof func) != "function") throw "Expected function, found " + (typeof func) + " in call to to onDocumentLoaded";
    $$$.model.onStartup[$$$.model.onStartup.length] = func;
};


$$$.initFramework = function () {
    let allTags = document.getElementsByTagName('*');
    let t = null;
    let i = 0;
    let a = null;
    for (i = 0; i < allTags.length; i++) {
        t = allTags[i];
        if (t.hasAttribute("accordian")) {
            a = t.getAttribute("accordian");
            if (a == 'true') {
                $$$.toAccordian(t);
            }
        }
    }
    let x = 0;
    while (x < $$$.model.onStartup.length) {
        $$$.model.onStartup[x++]();
    }
    //setting modal part starts here
    var all = document.getElementsByTagName("*");

    for (i = 0; i < all.length; i++) {
        if (all[i].hasAttribute('forModal')) {
            if (all[i].getAttribute('forModal').toUpperCase() == 'TRUE') {
                all[i].setAttribute("forModal", false);// reason lec 77 30:31(horrible mistake)
                $$$.model.modals[$$$.model.modals.length] = new Modal(all[i]);
                i--;
            }
        }
    }
    //setting modal part ends here
}// end of initFramework

function TMJRockElement(element) {
    this.element = element;
    this.html = function (content) {
        //for if this element is span or not by checking it's innerHTML property
        //if property doesn't exist it becomes false
        //we tried to do this (this.element.innerHTMl) instead of this 
        //but the main issue here is if the innerHTML property contains 
        //,"" empty string the result will be false or undefined i guess 
        //that's why we had to use this techinque or trick to identify is the element is span or not
        if (typeof this.element.innerHTML == "string") {
            if ((typeof content) == "string") {
                this.element.innerHTML = content;
            }
            return this.element.innerHTML;
        }
        return null;
    }//html function ends

    this.value = function (content) {
        if (typeof this.element.value) {
            if ((typeof content) == "string") {
                this.element.value = content;
            }
            return this.element.value;
        }
        return null;
    }//value function ends
    this.fillComboBox = function (jsonObject) {
        if (this.element.nodeName != "SELECT") throw "fillComboBox can be called on a SELECT type object only";
        if (!jsonObject["dataSource"]) throw "dataSource property is missing in call to fillComboBox";
        let dataSource = jsonObject["dataSource"];
        if (!(Array.isArray(dataSource))) throw "dataSource property must be an array collection in call to fillComboBox";
        if (!jsonObject["text"]) throw "text property is missing in call to fillComboBox";
        let text = jsonObject["text"];
        if ((typeof text) != "string") throw "text property should be of string type in call to fillComboBox";
        if (!jsonObject["value"]) throw "value property is missing in call to fillComboBox";
        let value = jsonObject["value"];
        if ((typeof value) != "string") throw "value property should be of string type in call to fillComboBox";
        if (!dataSource[0][text]) throw "invalid text property for dataSource";
        if (!dataSource[0][value]) throw "invalid value property for dataSource";
        let option;
        let firstOptionExists = false;
        if (jsonObject["firstOption"]) {
            let firstOption = jsonObject["firstOption"];
            if (!firstOption["text"]) throw "text property of firstOption is missing in call to fillComboBox";
            var firstOptionText = firstOption["text"];
            if ((typeof firstOptionText) != "string") throw "text property of firstOption should be of string type in call fillComboBox";
            if (!firstOption["value"]) throw "value property of firstOption is missing in call to fillComboBox";
            var firstOptionValue = firstOption["value"];
            if ((typeof firstOptionValue) != "string") throw "value property of firstOption should be of string type in call fillComboBox";
            firstOptionExists = true
        }
        this.element.options.length = 0;
        if (firstOptionExists) {
            option = document.createElement("option");
            option.text = firstOptionText;
            option.value = firstOptionValue;
            this.element.appendChild(option);
        }
        for (let i = 0; i < dataSource.length; i++) {
            option = document.createElement('option');
            option.text = dataSource[i][text];
            option.value = dataSource[i][value];
            this.element.appendChild(option);
        }
    }
}//TMJRockclass ends
$$$.ajax = function (jsonObject) {
    if (!jsonObject["url"]) throw "url property is missing in call to ajax";
    let url = jsonObject["url"];
    if ((typeof url) != "string") throw "url property should be string type in call to ajax";
    let methodType;
    if (jsonObject["methodType"]) {
        methodType = jsonObject["methodType"];
        if ((typeof methodType) != "string") throw "methodType property should be string type in call to ajax";
        methodType = methodType.toUpperCase();
        if (["GET", "POST"].includes(methodType) == false) throw "methodType should be GET/POST in call to ajax";
    }
    let onSuccess = null;
    if (jsonObject["success"]) {
        onSuccess = jsonObject["success"];
        if ((typeof onSuccess) != "function") throw "success property should be a function in call to ajax";
    }
    let onFailure = null;
    if (jsonObject["failure"]) {
        onFailure = jsonObject["failure"];
        if ((typeof onFailure) != "function") throw "failure property should be a function in call to ajax";
    }

    if (methodType == "GET") {
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var responseData = this.responseText;

                    if (onSuccess) onSuccess(responseData);
                }
                else {
                    alert('some problem');
                    if (onFailure) onFailure();
                }
            }
        };
        if (jsonObject["data"]) {

            let jsonData = jsonObject["data"];
            let queryString = "";
            let qsName;
            let qsValue;
            let xx = 0;

            for (k in jsonData) {
                if (xx == 0) queryString = '?';
                if (xx > 0) queryString += '&';
                xx++;
                qsName = encodeURI(k);
                qsValue = encodeURI(jsonData[k]);
                queryString += qsName + "=" + qsValue;
            }
            url = url + queryString;
        }
        xmlHttpRequest.open(methodType, url, true);
        xmlHttpRequest.send();
    } else
        if (methodType == "POST") {

            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status <=299) {
                        var responseData = this.responseText;
                        if (onSuccess) onSuccess(responseData);
                    }
                    else {
                        alert('some problem');
                        if (onFailure) onFailure();
                    }
                }
            };
            let sendJSON = jsonObject["sendJSON"];
            if (!sendJSON) sendJSON = false;
            if ((typeof sendJSON) != "boolean") throw "sendJSON property should be of boolean type in ajax call";

            let jsonData = {};
            let queryString = "";
            if (jsonObject["data"]) {
                if (sendJSON) {
                    jsonData = jsonObject["data"];
                }
                else {
                    jsonData = jsonObject["data"];
                    let qsName;
                    let qsValue;
                    queryString = "";
                    let xx = 0;

                    for (k in jsonData) {
                        //if(xx==0) queryString='?';
                        if (xx > 0) queryString += '&';
                        xx++;
                        qsName = encodeURI(k);
                        qsValue = encodeURI(jsonData[k]);
                        queryString += qsName + "=" + qsValue;
                    }
                }
            }
            xmlHttpRequest.open(methodType, url, true);
            if (sendJSON) {
                xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
                xmlHttpRequest.send(JSON.stringify(jsonData));
            }
            else {
                xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttpRequest.send(queryString);
            }
        }//post part ends here
}//function ajax ends

window.addEventListener('load', function () {
    $$$.initFramework();
});


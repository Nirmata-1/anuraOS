
/**
 * the purpose of the following code is to give a demo of
 * how to realize the floating dialog using javascript.
 * It was written without any consideration of cross-browser compatibility,
 * and it can be run successfully under the firefox 3.5.7.
 *
 * nope nope this code has NOT been stolen rafflesia did NOT make it :thumbsup:
 */
var AliceWM = {};

/**
 * to show a floating dialog displaying the given dom element
 * @param {Object} title "title of the dialog"
 */

let windowID = 0;
AliceWM.create = function(title){ // CODE ORIGINALLY FROM https://gist.github.com/chwkai/290488

    // initializing dialog: title, close, content
    var container = document.createElement("div");
    var titleContainer = document.createElement("div");
    var titleContent = document.createElement("div");

    var contentContainer = document.createElement("div");
    var closeContainer = document.createElement("button");
    var maximizeContainer = document.createElement("button");
    var minimizeContainer = document.createElement("button");

    container.setAttribute("id", "aliceWMwin");
    container.setAttribute("style", "resize: both;")

    titleContainer.setAttribute("id", "title");

    contentContainer.setAttribute("id", "content");
    contentContainer.setAttribute("style", "width: 100%; padding:0; margin:0; ")

    titleContent.setAttribute("id", "titleContent");
    titleContent.innerHTML = title;

    closeContainer.setAttribute("id", "close");
    closeContainer.setAttribute("class", "windowButton");
    closeContainer.innerHTML = '<i class="fa-solid fa-xmark fa-fw"></i>';

    maximizeContainer.setAttribute("id", "maximize");
    maximizeContainer.setAttribute("class", "windowButton");
    maximizeContainer.innerHTML = '<i class="fa-solid fa-window-maximize fa-fw"></i>'

    minimizeContainer.setAttribute("id", "minimize");
    minimizeContainer.setAttribute("class", "windowButton");
    minimizeContainer.innerHTML = '<i class="fa-solid fa-window-minimize fa-fw"></i>';

    titleContainer.appendChild(titleContent);
    titleContainer.appendChild(minimizeContainer);
    titleContainer.appendChild(maximizeContainer);
    titleContainer.appendChild(closeContainer);

    container.appendChild(titleContainer);
    container.appendChild(contentContainer);
    document.body.appendChild(container);

    // place the container in the center of the browser window
    window.center(container);

    // binding mouse events
    closeContainer.onclick = function(evt){
        if (container._overlay){
            container._overlay.parentNode.removeChild(container._overlay);
        }

        container.parentNode.removeChild(container);
        // calling the callback function to notify the dialog closed
        evt.stopPropagation();
    };

    // start dragging when the mouse clicked in the title area
    titleContainer.onmousedown = function(evt){
        // probably inefficient but i dont caare
        var allWindows = [...document.querySelectorAll("#aliceWMwin")];
        // console.debug(allWindows); // this line is fucking crashing edge for some reason
        for(const wmwindow of allWindows) {
            wmwindow.style.setProperty("z-index", 92);
        }
        titleContainer.parentNode.style.setProperty("z-index", 93); // stay on top

        evt = evt || window.event;

        container._dragging = true;
        container._originalLeft = container.offsetLeft;
        container._originalTop = container.offsetTop;
        container._mouseLeft = evt.clientX;
        container._mouseTop = evt.clientY;
    };

    // do the dragging during the mouse move
    document.addEventListener('mousemove', (evt) => {
        evt = evt || window.event;

        if(container._dragging){
            container.style.left =
                (container._originalLeft + evt.clientX - container._mouseLeft) + "px";
            container.style.top =
                (container._originalTop + evt.clientY - container._mouseTop) + "px";
        }
    })

    // finish the dragging when release the mouse button
    document.addEventListener('mouseup', (evt) => {
        evt = evt || window.event;

        if(container._dragging){
            container.style.left =
                (container._originalLeft + evt.clientX - container._mouseLeft) + "px";
            container.style.top =
                (container._originalTop + evt.clientY - container._mouseTop) + "px";

            container._dragging = false;
        }
    });
    windowID++;
    return {content: contentContainer};
};



/**
 * place the given dom element in the center of the browser window
 * @param {Object} element
 */
function center(element){
    if(element){
        element.style.left = (window.innerWidth - element.offsetWidth) / 2 + "px";
        element.style.top = (window.innerHeight - element.offsetHeight) / 2 + "px";
    }
}

/**
 * callback function for the dialog closed event
 * @param {Object} container
 */

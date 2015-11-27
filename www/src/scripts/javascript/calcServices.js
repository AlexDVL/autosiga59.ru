var count = 1; // Счетчик для вывода нескольких блоков в soundOutput.
var typeCalc; // Тип текущего калькулятора.
var calcTotalPrice = 0; // Переменная для общей цены.

// Хранит блоки для вывода
/*
    Параметр 1:
        false - select;
        true  - input;
    Параметр 2:
        false - цены нету;
        true  - цена есть;
    Параметр 3:
        false - изображения нету;
        true  - изображение есть;
    Параметр 4:
        false - примечания нету;
        true  - примечание есть;

    Порядок записи: Параметры -> Значение -> Цена (если есть) ->
                    Картинка (если есть) -> Примечание (если есть).
*/
var soundBlocks =
{
    typeSound: [
                    false, false, false,
                    "Автомагнитолы", "Динамики", "Усилители, сабвуферы"
               ],
    jackSound: [
                    false, false, false,
                    "1 Din", "2 Din", "Штатные ГУ"
               ],
    iso:       [
                    true, false, true,
                    "ISO разъем отсутствует", 300
               ],
    regionCar: [
                    false, false, true,
                    "Иномарка", 500, "Отечественная", 600
               ],
    antennaBosch: [
                    true, false, true,
                    "Установка антенны типа Bosch", 800
               ],
    cutPlastic: [
                    true, false, true,
                    "Надо или нет резать пластик", 700
               ]
};

// В случае нажатия на один из элементов, будут выведены блоки из soundBlocks.
var soundOutput =
{
    "Автомагнитолы": [soundBlocks.jackSound],
    "1 Din": [soundBlocks.iso, soundBlocks.regionCar],
    "2 Din": [soundBlocks.cutPlastic],
    "Иномарка": [soundBlocks.antennaBosch],
    "ISO разъем отсутствует": [soundBlocks.regionCar]
};

// Функция отвечает за вывод типа калькулятора.
// service - имя типа.
function calcServices(service)
{
    switch (service)
    {
        case "Sound":
            createInnerDiv(document.getElementById("calcServices"), soundBlocks.typeSound);
            typeCalc = soundOutput;
            break;
    }

    // Создание блока с общей ценой.
    var divPrice = document.createElement("div");
    divPrice.id = "totalPrice";
    divPrice.innerHTML = calcTotalPrice;
    document.getElementById("content").appendChild(divPrice);
}

// Функция просчитывает общую цену в случае события.
// element - текущий нажатый элемент.
// currentActiveElement - предыдущий нажатый элемент в данном блоке.
function pricing(element, currentActiveElement)
{
    var childElements = element.parentNode.getElementsByTagName("span");
    for (var i = 0; i < childElements.length; i++)
    {
        if (childElements[i].className === "priceService")
        {
            var parentChild = childElements[i].parentNode;
            if (parentChild !== element &&
                parentChild.className.slice(12,25) === "activeElement")
            {
                calcTotalPrice -= Number(childElements[i].innerHTML);
            }
            if (parentChild === currentActiveElement &&
                parentChild.tagName !== "LABEL")
            {
                calcTotalPrice -= Number(childElements[i].innerHTML);
            }
            if (parentChild === element)
                if (parentChild.tagName === "LABEL")
                {
                    if (parentChild.firstChild.checked === true)
                        calcTotalPrice += Number(childElements[i].innerHTML);
                    else
                        calcTotalPrice -= Number(childElements[i].innerHTML);
                }
                else
                    calcTotalPrice += Number(childElements[i].innerHTML);
        }
    }
    document.getElementById("totalPrice").innerHTML = calcTotalPrice;
}

// Функция срабатывает при нажатии на элемент.
// element - сработавший элемент.
function clickCalcElement(element)
{
    var elementChildrens = element.parentNode.childNodes;

    // Получаем предыдущий активный элемент в данном блоке.
    for (var i = 0; i < elementChildrens.length; i++)
        if (elementChildrens[i].className.slice(12,25) === "activeElement")
        {
            var currentActiveElement = elementChildrens[i];
            break;
        }

    // Переприсваеваем активный класс, если элемент равен текущему элементу,
    // то останов.
    if (addRemoveActiveClass(element, currentActiveElement) === false)
        return false;

    var nameService, priceService, i;
    var elementChildren = element.childNodes;

    // Получаем имя текущего элемента.
    for (i = 0; i < elementChildren.length; i++)
    {
        if (elementChildren[i].className === "nameService")
            nameService = elementChildren[i].innerHTML;
    }

    // Пересчитываем цену.
    pricing(element, currentActiveElement);

    // Если для checkbox не определено дальнейшее действие, то останов.
    if (element.tagName === "LABEL" && typeCalc[nameService] === undefined)
        return false;

    // Первая проверка - заглушка, при заполненном калькуляторе должна быть убрана.
    // Вторая проверка - удаляет все и останов, в случае удаления галки в checkbox.
    if (typeCalc[nameService] === undefined || element.firstChild.checked === false)
    {
        removeInnerBlock(element.parentNode);
        return false;
    }

    // Строим первый блок (или последний)
    createInnerDiv(element, typeCalc[nameService][0]);

    // Если необходимо вывести несколько блоков, то указываем размер в count.
    if (typeCalc[nameService].length > 1)
        count = typeCalc[nameService].length;

    // Строим следующий блок и уменьшаем count.
    for (i = 1; i < count; i++)
    {
        createInnerDiv(element, typeCalc[nameService][i]);
        count--;
    }
}

// Функция удаляет активный класс у currentActiveElement
// и добавляет активный класс к element.
function addRemoveActiveClass(element, currentActiveElement)
{
    currentActiveElement = currentActiveElement || false;
    var activeClass = element.className.slice(12,25);

    // Если элемент label, то либо снимаем, либо выставляем галку
    // в checkbox.
    if (element.tagName === "LABEL")
    {
        if (activeClass === "activeElement")
        {
            element.className = "calcElement";
            element.firstChild.checked = false;
        }
        else
        {
            element.className += " activeElement";
            element.firstChild.checked = true;
        }
        return element;
    }

    // Если элемент не label, и уже активный, то останов.
    if (activeClass === "activeElement")
        return false;

    if (currentActiveElement)
        currentActiveElement.className = "calcElement";

    element.className += " activeElement";

    return element;
}

// Функция для удаления div.inner.
// element - родитель, в котором хранится div.inner.
function removeInnerBlock(element)
{
    if (element.lastChild.className === "inner" && count === 1)
        element.removeChild(element.lastChild);
}

// Функция создает div.inner и запускает функцию создания детей.
// element - сработавший элемент, массив с параметрами и значениями.
function createInnerDiv(element, serviceArray)
{
    var parentInnerDiv = element.parentNode;

    // Сначала удаляем имеющийся блок div.inner (если есть).
    removeInnerBlock(element.parentNode);

    if (parentInnerDiv.lastChild.className !== "inner")
    {
        var innerDiv = document.createElement("div");
        innerDiv.className = "inner";
        parentInnerDiv.appendChild(innerDiv);
    }

    createElementsInnerDiv(parentInnerDiv, serviceArray);
    createBr(parentInnerDiv.lastChild);
}

// Функция создает детей для div.inner.
//
// Структура: div.inner -> <div><label.calcElement></lable></div> ->
//                         <div><div.calcElement></div><div.calcElement></div></div>.
//
// parentInnerDiv - родитель, в котором был создан div.inner.
// serviceArray   - массив с параметрами и значениями.
function createElementsInnerDiv(parentInnerDiv, serviceArray)
{
    // Создаем внутренний div для текущего блока.
    var elementsDiv = document.createElement("div");
    parentInnerDiv.lastChild.appendChild(elementsDiv);

    // Функция для события onclick элементов.
    var click = function() { clickCalcElement(this); return false;};

    for (var i = 3; i < serviceArray.length; i++)
    {
        // Создаем блок для имени.
        var spanName = document.createElement("span");
        spanName.className = "nameService";
        spanName.innerHTML += serviceArray[i];

        // Если не label, то создаем div блоки.
        if (!serviceArray[0])
        {
            var calcElement = document.createElement("div");
            calcElement.className = "calcElement";
            calcElement.onclick = click;
            calcElement.appendChild(spanName);
            parentInnerDiv.lastChild.lastChild.appendChild(calcElement); 
        }
        else // Иначе label блоки.
        {
            var checkbox = document.createElement("input");
            var label = document.createElement("label");
            label.className = "calcElement";
            checkbox.type = "checkbox";
            label.onclick = click;
            label.appendChild(checkbox);
            label.appendChild(spanName);
            parentInnerDiv.lastChild.lastChild.appendChild(label);
        }            

        // Если есть цена, то добавляем.
        if (serviceArray[2])
        {
            var spanPrice = document.createElement("span");
            spanPrice.className = "priceService";
            spanPrice.innerHTML = serviceArray[i+1];
            if (calcElement)
                calcElement.appendChild(spanPrice);
            else
                label.appendChild(spanPrice);
            i++; // Цена идет втором элементов, необходим скачек на два элемента.
        }
    }
}

function createBr(innerDiv)
{
    var br = document.createElement("br");
    innerDiv.appendChild(br);
}

calcServices("Sound");
const radioActiveImgUrl = './src/images/radio-active.svg';
const radioImgUrl = './src/images/radio.svg';
const checkboxImgUrl = './src/images/checkbox.svg';
const checkboxActiveImgUrl = './src/images/checkbox-active.svg';
const testItems = Array.from(document.querySelectorAll('.test__item'));
const button = document.querySelector('.test__button');
const testContainer = document.querySelector('.test__list');
const testItemTemplate = document.querySelector('#test__item-template').content;
const optionsItemTemplate = document.querySelector('#answer-options__item-template').content;
const initialQuestions = [
    {
        qustion: '1. В каких случаях перспективно применение следовых кинологических расчётов?',
        checkboxType: 'checkbox',
        options: [
            {
                id: 1,
                text: 'Оказание помощи гражданам, оказавшимся в зонах бедствия или пропавшим в безлюдной местности'
            },
            {
                id: 2,
                text: 'Обучение животного идти как по горячему, так и по остывшему следу'
            },
            {
                id: 3,
                text: 'Поиск тел и их остатков с применением специально обученных собак'
            }
        ]
    },

    {
        qustion: '2. С какого возраста следует начинать дрессировку по курсу ПСС?',
        checkboxType: 'radio',
        options: [
            {
                id: 1,
                text: '6 месяцев'
            },
            {
                id: 2,
                text: '1–1,5 года'
            },
            {
                id: 3,
                text: '3 года'
            },
        ]
    },
];

const handleCheckboxClick = (event, answerOptionsList) => {
    const label = event.target.nextSibling.nextSibling.children[1];
    const img = event.target.nextSibling.nextSibling.children[0];

    if (answerOptionsList) {
        const radioCheckboxes = Array.from(answerOptionsList.querySelectorAll('input[type=radio]'));
        radioCheckboxes.forEach((item) => {
            item.nextSibling.nextSibling.children[0].src = radioImgUrl;
            item.nextSibling.nextSibling.children[1].classList.remove('answer-options__checkbox-label_checked');
        });
        label.classList.add('answer-options__checkbox-label_checked');
        img.src = radioActiveImgUrl;
    }
    else {
        label.classList.toggle('answer-options__checkbox-label_checked');
        event.target.checked ? img.src = checkboxActiveImgUrl : img.src = checkboxImgUrl;
    }

    isButtonActive();

};

const isButtonActive = () => {
    const testItems = Array.from(document.querySelector('.test__list').children);
    const active = testItems.every((item) => {
        const inputs = Array.from(item.querySelectorAll('.answer-options__checkbox-input'));
        return inputs.filter((item) => item.checked).length > 0
    });
    const inputsFirstQuestion = Array.from(testItems[0].querySelectorAll('.answer-options__checkbox-input'));
    const inputsSecondQuestion = Array.from(testItems[1].querySelectorAll('.answer-options__checkbox-input'));
    const testSuccess = (inputsFirstQuestion.filter((item) => item.checked).length > 1) 
    && (inputsSecondQuestion.filter((item) => item.checked && item.value === '2').length > 0);

    if(active && testSuccess) {
        button.href = "./test-success.html";
        button.classList.remove("test__button_disabled");
    }
    else if (active && !testSuccess) {
        button.href = "./test-failed.html";
        button.classList.remove("test__button_disabled");
    }
    else {
        button.href = "#";
        button.classList.add("test__button_disabled");
    }
}

const createOptionsItem = (option, checkboxType, answerOptionsList) => {
    const optionsItem = optionsItemTemplate.querySelector('.answer-options__item').cloneNode(true);
    const optionsItemLabel = optionsItem.querySelector('.answer-options__checkbox-label');
    const checkboxImg = optionsItem.querySelector('.answer-options__checkbox-img');
    const checkboxInput = optionsItem.querySelector('.answer-options__checkbox-input');

    optionsItemLabel.textContent = option.text;
    checkboxInput.setAttribute('value', option.id);

    if (checkboxType === 'radio') {
        checkboxInput.type = 'radio';
        checkboxInput.name = 'test';
        checkboxImg.src = radioImgUrl;
        checkboxInput.addEventListener('click', (event) => handleCheckboxClick(event, answerOptionsList))
    }
    else {
        checkboxInput.type = 'checkbox'
        checkboxImg.src = checkboxImgUrl;
        checkboxInput.addEventListener('click', handleCheckboxClick)
    }

    return optionsItem;

};

function createQuestionItem(question) {
    const testItem = testItemTemplate.querySelector('.test__item').cloneNode(true);
    const testQuestion = testItem.querySelector('.test__question');
    const answerOptionsList = testItem.querySelector('.answer-options__list');

    testQuestion.textContent = question.question;
    question.options.forEach(el => answerOptionsList.append(createOptionsItem(el, question.checkboxType, answerOptionsList)));

    return testItem;

};



initialQuestions.forEach(el => testContainer.append(createQuestionItem(el)));



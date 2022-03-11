const radioActiveImgUrl = './src/images/radio-active.svg';
const radioImgUrl = './src/images/radio.svg';
const checkboxImgUrl = './src/images/checkbox.svg';
const checkboxActiveImgUrl = './src/images/checkbox-active.svg';
const testItems = Array.from(document.querySelectorAll('.test__item'));
const retryButtonFailedTemplate = '<img src="./src/images/refresh-icon.svg" alt="Иконка обновления">Пересдать';
const retryButtonSuccessTemplate = '<img src="./src/images/refresh-orange.svg" alt="Иконка обновления">Пересдать';
const form = document.querySelector('.test')
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
                success: true,
                text: 'Оказание помощи гражданам, оказавшимся в зонах бедствия или пропавшим в безлюдной местности'
            },
            {
                id: 2,
                success: true,
                text: 'Обучение животного идти как по горячему, так и по остывшему следу'
            },
            {
                id: 3,
                success: true,
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
                success: false,
                text: '6 месяцев'
            },
            {
                id: 2,
                success: true,
                text: '1–1,5 года'
            },
            {
                id: 3,
                success: false,
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
            item.nextSibling.nextSibling.children[1].classList.remove('answer-options__label_checked');
        });
        label.classList.add('answer-options__label_checked');
        img.src = radioActiveImgUrl;
    }
    else {
        label.classList.toggle('answer-options__label_checked');
        event.target.checked ? img.src = checkboxActiveImgUrl : img.src = checkboxImgUrl;
    }

    isButtonActive();

};

const isButtonActive = () => {
    const button = document.querySelector('.test__button');
    const testItems = Array.from(document.querySelector('.test__list').children);
    const active = testItems.every((item) => {
        const inputs = Array.from(item.querySelectorAll('.answer-options__checkbox-input'));
        return inputs.filter((item) => item.checked).length > 0
    });
    active ? button.removeAttribute('disabled') : button.setAttribute('disabled', 'true');
};

const createOptionsItem = (option, checkboxType, answerOptionsList) => {
    const optionsItem = optionsItemTemplate.querySelector('.answer-options__item').cloneNode(true);
    const optionsItemLabel = optionsItem.querySelector('.answer-options__label');
    const checkboxImg = optionsItem.querySelector('.answer-options__img');
    const checkboxInput = optionsItem.querySelector('.answer-options__checkbox-input');

    optionsItemLabel.textContent = option.text;
    checkboxInput.setAttribute('value', option.id);
    checkboxInput.setAttribute('success', option.success);

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

const insertInitialButton = () => {
    testContainer.after(renderFormButton('Показать результат', true, checkTestResult, []));
};

const insertInitialQuestions = () => {
    initialQuestions.forEach(el => testContainer.append(createQuestionItem(el)));
};

const handleRetryButtonClick = (event) => {
    event.preventDefault();
    const button = document.querySelector('.test__button');
    testContainer.innerHTML = '';
    button.remove();
    insertInitialQuestions();
    insertInitialButton();

};


const checkTestResult = (event) => {
    event.preventDefault()
    const testItems = Array.from(document.querySelector('.test__list').children);
    const button = document.querySelector('.test__button');
    const inputsFirstQuestion = Array.from(testItems[0].querySelectorAll('.answer-options__checkbox-input'));
    const inputsSecondQuestion = Array.from(testItems[1].querySelectorAll('.answer-options__checkbox-input'));
    const inputs = [...inputsFirstQuestion, ...inputsSecondQuestion]
    const testSuccess = (inputsFirstQuestion.filter((item) => item.checked).length > 1) 
    && (inputsSecondQuestion.filter((item) => item.checked && item.value === '2').length > 0);

        inputs.forEach((item) => {
            const img = item.nextSibling.nextSibling.querySelector('.answer-options__img');
            const label = item.nextSibling.nextSibling.querySelector('.answer-options__label');

            item.setAttribute('disabled', 'true');
            if (item.checked) {
                if(item.getAttribute('success') === 'true') {
                    img.src = './src/images/success-icon.svg';
                    label.classList.add('answer-options__label_success');
                }
                else {
                    img.src = './src/images/faild-icon.svg';
                    label.classList.add('answer-options__label_failed');
                }
            }
            else {
                if(item.getAttribute('success') === 'true') {
                    img.src = './src/images/success.svg';
                }
                else {
                    img.src = './src/images/error.svg';
                }
            }
        });
        if(testSuccess) {
            form.replaceChild(renderFormButton(retryButtonSuccessTemplate, false, handleRetryButtonClick, ['test__button_success']), button);
        }
        else {
            form.replaceChild(renderFormButton(retryButtonFailedTemplate, false, handleRetryButtonClick,), button);
        }
        

}

const renderFormButton = (children, disabled, callback, classes= []) => {
    const newButton = document.createElement('button');
    newButton.type = 'submit';
    newButton.classList.add('test__button', ...classes);
    newButton.innerHTML = children;
    newButton.addEventListener('click', callback);
    disabled ? newButton.setAttribute('disabled', 'true') : newButton.removeAttribute('disabled');
    return newButton
};


insertInitialQuestions();
insertInitialButton();



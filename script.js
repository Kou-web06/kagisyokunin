document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const includeUppercase = document.getElementById('includeUppercase');
    const includeLowercase = document.getElementById('includeLowercase');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSymbols = document.getElementById('includeSymbols');
    const excludeSimilarChars = document.getElementById('excludeSimilarChars');
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const generateButton = document.getElementById('generateButton');
    const generatedPassword = document.getElementById('generatedPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const copyButton = document.getElementById('copyButton');
    const toast = document.getElementById('toast');
    const loading = document.getElementById('loading');
    
    // モーダル関連のDOM要素
    const modal = document.getElementById('character-modal');
    const closeModal = document.querySelector('.close-button');
    const modalGeneratedPassword = document.getElementById('modalGeneratedPassword');
    const modalCopyButton = document.getElementById('modalCopyButton');
    
    // Notionモーダル関連のDOM要素
    const notionModal = document.getElementById('notion-modal');
    const notionCloseButton = document.getElementById('notion-close-button');
    const formSvg = document.querySelector('header .form svg');

    // 文字セット
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = /[il1Lo0O]/g;

    // パスワード長スライダーの値を表示に反映
    passwordLength.addEventListener('input', () => {
        lengthValue.textContent = passwordLength.value;
    });

    // 生成ボタンのクリックイベント
    generateButton.addEventListener('click', () => {
        generatedPassword.value = '';
        strengthText.textContent = '';
        strengthBar.style.width = '0%';
        loading.style.display = 'block';
        generatedPassword.style.display = 'none';

        setTimeout(() => {
            const length = passwordLength.value;
            let charset = '';
            let requiredChars = [];

            if (includeUppercase.checked) {
                charset += upperCaseChars;
                requiredChars.push(getRandomChar(upperCaseChars));
            }
            if (includeLowercase.checked) {
                charset += lowerCaseChars;
                requiredChars.push(getRandomChar(lowerCaseChars));
            }
            if (includeNumbers.checked) {
                charset += numberChars;
                requiredChars.push(getRandomChar(numberChars));
            }
            if (includeSymbols.checked) {
                charset += symbolChars;
                requiredChars.push(getRandomChar(symbolChars));
            }

            if (charset === '') {
                alert('少なくとも1種類の文字を選択してください。');
                loading.style.display = 'none';
                generatedPassword.style.display = 'block';
                return;
            }

            if (excludeSimilarChars.checked) {
                charset = charset.replace(similarChars, '');
            }

            let password = requiredChars.join('');
            for (let i = requiredChars.length; i < length; i++) {
                password += getRandomChar(charset);
            }

            password = password.split('').sort(() => 0.5 - Math.random()).join('');

            loading.style.display = 'none';
            generatedPassword.style.display = 'block';
            
            // メインとモーダルの両方にパスワードを設定
            generatedPassword.value = password;
            modalGeneratedPassword.value = password;

            updateStrengthIndicator(password);
            showModal();
        }, 500);
    });

    // メインのコピーボタン
    copyButton.addEventListener('click', () => {
        copyToClipboard(generatedPassword.value);
    });

    // モーダルのコピーボタン
    modalCopyButton.addEventListener('click', () => {
        copyToClipboard(modalGeneratedPassword.value);
    });
    
    // クリップボードへコピーする共通関数
    function copyToClipboard(text) {
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            });
        }
    }

    // モーダルを閉じる
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Notionモーダルの制御
    if (formSvg) {
        formSvg.addEventListener('click', () => {
            notionModal.style.display = 'flex';
        });
    }

    // Notionモーダルを閉じる
    notionCloseButton.addEventListener('click', () => {
        notionModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target == notionModal) {
            notionModal.style.display = 'none';
        }
    });

    function getRandomChar(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    function updateStrengthIndicator(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*()]/.test(password)) score++;

        let strength = '';
        let color = '';
        let width = '0%';

        if (score < 3) {
            strength = '弱い';
            color = '#e74c3c';
            width = '33%';
        } else if (score < 6) {
            strength = '普通';
            color = '#f1c40f';
            width = '66%';
        } else {
            strength = '強力';
            color = '#2ecc71';
            width = '100%';
        }
        strengthText.textContent = strength;
        strengthBar.style.backgroundColor = color;
        strengthBar.style.width = width;
    }
    
    function showModal() {
        modal.style.display = 'flex';
    }
});
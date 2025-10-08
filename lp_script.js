document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');

    if (!fadeInElements.length) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // 要素が10%見えたらトリガー
    });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });
});

// main.htmlへの遷移時にローディングアニメーションを表示
function navigateToMain(event) {
    event.preventDefault(); // デフォルトのリンク動作を防ぐ
    
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // ローディングアニメーションを表示
    loadingOverlay.style.display = 'flex';
    
    // 3秒後にmain.htmlに遷移
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 3000);
}

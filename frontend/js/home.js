document.addEventListener('DOMContentLoaded', () => {
    // Manipulação do menu hambúrguer
    document.getElementById('menu-btn').addEventListener('click', () => {
        const menu = document.getElementById('menu');
        menu.classList.toggle('active');
        
        // Atualiza o atributo aria-expanded
        const hamburger = document.getElementById('menu-btn');
        const isActive = menu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Define a função chamada scrollFunction que é chamada sempre que ocorre um evento de rolagem
    window.onscroll = function() {
        scrollFunction();
    };

    // Função para mostrar ou ocultar o botão de voltar ao topo, dependendo da posição de rolagem
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("btnTopo").style.display = "block";
        } else {
            document.getElementById("btnTopo").style.display = "none";
        }
    }

    // Função para rolar a página de volta ao topo quando o botão de voltar ao topo é clicado
    function scrollToTop() {
        document.body.scrollTop = 0; 
        document.documentElement.scrollTop = 0; 
    }

    // Adicionando o evento de click para o botão voltar ao topo
    document.getElementById('btnTopo').addEventListener('click', scrollToTop);
});

/*--------------- menu de navegação ----------------- */
(() => {
    const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu(){
        navMenu.classList.toggle("open");
        fadeOutEffect();
    }

    function hideNavMenu(){
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();
    }

    function fadeOutEffect(){
        document.querySelector(".fade-out-effect").classList.add("active");
        bodyScrollingToggle();
        setTimeout(() => {
            document.querySelector(".fade-out-effect").classList.remove("active");
        }, 300);
    }

    /*----------- adicionar um manipulador de evento ao documento ---------- */
    document.addEventListener("click", (event) =>{
        if(event.target.classList.contains('link-item')){
            // garante que event.target.hash tenha valor antes de sobrescrever o comportamento padrão
            if(event.target.hash !== ""){
                // previne o comportamento padrão do clique em âncora
                event.preventDefault();
                const hash = event.target.hash;
                // desativa a seção atualmente ativa
                document.querySelector(".section.active").classList.add(".hide");
                document.querySelector(".section.active").classList.remove("active");
                // ativa a nova seção
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");
                // desativa o link ativo do menu de navegação
                navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active", "inner-shadow");
                // se o link clicado estiver dentro do menu de navegação
                if(navMenu.classList.contains("open")){
                    // ativa o novo link do menu de navegação
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");
                    // esconde o menu de navegação
                    hideNavMenu();
                }
                else{
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) =>{
                        if(hash === item.hash){
                            // ativa o novo link do menu de navegação
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("inner-shadow", "hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }
                // adiciona o hash (#) na URL
                window.location.hash = hash;
            }
        }
    })
})();

// seção "sobre"
(() => {
    const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener("click", (event) => {
        if(event.target.classList.contains("tab-item") && !event.target.classList.contains("active")){
            const target = event.target.getAttribute("data-target");
            tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            event.target.classList.add("active", "outer-shadow")
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            aboutSection.querySelector(target).classList.add("active");
        }
    })
    
})();

function bodyScrollingToggle() {
}

/* --------------- filtro de portfólio e popup ----------------- */
(() => {
    const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    preBtn = popup.querySelector(".pp-pre"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    project_details = popup.querySelector(".pp-project-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;

    /* filtrar itens do portfólio */
    filterContainer.addEventListener("click", (event) => {
        if(event.target.classList.contains("filter-item") &&
        !event.target.classList.contains("active")){
            // desativa o filtro atualmente ativo
            filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            // ativa o novo filtro
            event.target.classList.add("active", 'outer-shadow');

            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) =>{
                if(target === item.getAttribute("data-category") || target === 'all'){
                    item.classList.remove("hide");
                    item.classList.add("show");
                }
                else{
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    
    })

    portfolioItemsContainer.addEventListener("click", (event) =>{
        if(event.target.closest(".portfolio-item-inner")){
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
            // pega o índice do item do portfólio
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-image img").getAttribute("data-screenshots");
            // converte screenshots em array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1 ){
                preBtn.style.display = "none";
                nextBtn.style.display ="none";
            }
            else{
                preBtn.style.display = "block";
                nextBtn.style.display ="block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
        
    })

    closeBtn.addEventListener("click", () =>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex]
        const popupImg = popup.querySelector(".pp-img");
        /**
         * ativa o carregador até que a imagem do popup seja carregada
         */
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () =>{
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        let last_num = Number( screenshots.length);
        last_num-1;
        popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1 ) + " de " + last_num;
    }

    function sendmail(){
    }

    function popupDetails(){
        if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
            projectDetailsBtn.style.display = "none";
            popup.querySelector(".pp-details").style.maxHeight = "0px";
            popup.querySelector(".pp-details").classList.remove("active");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            return;
        }
        else{
            projectDetailsBtn.style.display = "block";
        }

        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        project_details.innerHTML = details;

        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
        popup.querySelector(".pp-title h2").innerHTML = title;

        const category = portfolioItems[itemIndex].getAttribute("data-category");
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
    }

    // próximo slide
    nextBtn.addEventListener("click", () =>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        popupSlideshow();
    })

    // slide anterior
    preBtn.addEventListener("click", () =>{
        if(slideIndex === 0){
            slideIndex = screenshots.length-1
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
    })

    projectDetailsBtn.addEventListener("click", () =>{
        popupDetailsToggle();
    })

    function popupDetailsToggle(){
        if(projectDetailsContainer.classList.contains("active")){
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");

            popup.querySelector(".pp-details").classList.remove("active");
            popup.querySelector(".pp-details").style.maxHeight = "0px";
        }
        else{
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");

            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.querySelector(".pp-details").classList.add("active");
            popup.scrollTo(0, projectDetailsContainer.offsetTop)
        }
    }
    
    /* --------------- esconder todas as seções exceto a ativa ----------------- */
    
})();

window.addEventListener("load", () =>{
    // pré-carregamento
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() =>{
        document.querySelector(".preloader").style.display = "none";
    }, 600)
})

/* =========================================================
   CONFIGURAÇÃO DO SUPABASE

   TROQUE APENAS OS DOIS VALORES ABAIXO.
========================================================= */


const SUPABASE_URL =
    "https://yarmvqhydfhanyrkinnu.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ieJhCcG6hHh477E-KTO6Uw_Tq2RC643";



/* =========================================================
   CLIENTE SUPABASE
========================================================= */

let supabaseClient = null;


const supabaseConfigured =
    SUPABASE_URL &&
    SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_URL.includes(
        "COLE_SUA"
    ) &&
    !SUPABASE_PUBLISHABLE_KEY.includes(
        "COLE_SUA"
    );


if (
    supabaseConfigured &&
    window.supabase
) {

    supabaseClient =
        window.supabase.createClient(

            SUPABASE_URL,

            SUPABASE_PUBLISHABLE_KEY

        );

}



/* =========================================================
   ELEMENTOS
========================================================= */

const form =
    document.getElementById(
        "leadForm"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


const phoneInput =
    document.getElementById(
        "telefone"
    );


const mobileCTA =
    document.getElementById(
        "mobileCTA"
    );



/* =========================================================
   ANO DO RODAPÉ
========================================================= */

const currentYear =
    document.getElementById(
        "currentYear"
    );


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}



/* =========================================================
   UTMs
========================================================= */

const UTM_FIELDS = [

    "utm_source",

    "utm_medium",

    "utm_campaign",

    "utm_content",

    "utm_term"

];



/*
    Captura UTMs da URL e armazena
    no navegador.

    Isso evita perder a origem caso
    a pessoa navegue antes de se cadastrar.
*/

function captureUTMs() {


    const params =
        new URLSearchParams(
            window.location.search
        );


    UTM_FIELDS.forEach(
        field => {


            const value =
                params.get(field);


            if (value) {


                localStorage.setItem(

                    field,

                    value

                );


            }


        }
    );


}



function getUTM(field) {


    const params =
        new URLSearchParams(
            window.location.search
        );


    return (

        params.get(field)

        ||

        localStorage.getItem(field)

        ||

        null

    );


}



captureUTMs();



/* =========================================================
   MÁSCARA WHATSAPP
========================================================= */

if (phoneInput) {


    phoneInput.addEventListener(

        "input",

        event => {


            let value =
                event.target.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        11
                    );


            if (
                value.length > 10
            ) {


                value =
                    value.replace(

                        /^(\d{2})(\d{5})(\d{4})$/,

                        "($1) $2-$3"

                    );


            }


            else if (
                value.length > 6
            ) {


                value =
                    value.replace(

                        /^(\d{2})(\d{4})(\d+)/,

                        "($1) $2-$3"

                    );


            }


            else if (
                value.length > 2
            ) {


                value =
                    value.replace(

                        /^(\d{2})(\d+)/,

                        "($1) $2"

                    );


            }


            else if (
                value.length > 0
            ) {


                value =
                    value.replace(

                        /^(\d*)/,

                        "($1"

                    );


            }


            event.target.value =
                value;


        }

    );


}



/* =========================================================
   VALIDAÇÃO WHATSAPP
========================================================= */

function isValidPhone(
    phone
) {


    const numbers =
        phone.replace(
            /\D/g,
            ""
        );


    return (

        numbers.length === 10

        ||

        numbers.length === 11

    );


}



/* =========================================================
   NORMALIZAÇÃO DE EMAIL
========================================================= */

function normalizeEmail(
    email
) {


    return email
        .trim()
        .toLowerCase();


}



/* =========================================================
   NORMALIZAÇÃO WHATSAPP
========================================================= */

function normalizePhone(
    phone
) {


    return phone
        .replace(
            /\D/g,
            ""
        );


}



/* =========================================================
   MENSAGENS
========================================================= */

function showMessage(
    message,
    type
) {


    if (!formMessage) {
        return;
    }


    formMessage.textContent =
        message;


    formMessage.className =
        `form-message ${type}`;


}



/* =========================================================
   LIMPAR MENSAGEM
========================================================= */

function clearMessage() {


    if (!formMessage) {
        return;
    }


    formMessage.textContent =
        "";


    formMessage.className =
        "form-message";


}



/* =========================================================
   ENVIO DO FORMULÁRIO
========================================================= */

if (form) {


    form.addEventListener(

        "submit",

        async event => {


            event.preventDefault();


            clearMessage();



            /* =========================================
               ANTI-SPAM
            ========================================== */

            const honeypot =
                document
                    .getElementById(
                        "website"
                    )
                    .value;


            if (honeypot) {


                return;


            }



            /* =========================================
               SUPABASE CONFIGURADO?
            ========================================== */

            if (
                !supabaseClient
            ) {


                showMessage(

                    "O banco de dados ainda não foi configurado. Adicione a URL e a chave pública do Supabase no arquivo script.js.",

                    "error"

                );


                return;


            }



            /* =========================================
               DADOS DO FORMULÁRIO
            ========================================== */

            const nome =
                document
                    .getElementById(
                        "nome"
                    )
                    .value
                    .trim();


            const email =
                normalizeEmail(

                    document
                        .getElementById(
                            "email"
                        )
                        .value

                );


            const whatsappFormatted =
                document
                    .getElementById(
                        "telefone"
                    )
                    .value
                    .trim();


            const consentimento =
                document
                    .getElementById(
                        "consentimento"
                    )
                    .checked;



            /* =========================================
               VALIDAÇÕES
            ========================================== */

            if (
                nome.length < 2
            ) {


                showMessage(

                    "Digite seu nome para continuar.",

                    "error"

                );


                return;


            }


            if (
                !isValidPhone(
                    whatsappFormatted
                )
            ) {


                showMessage(

                    "Digite um número de WhatsApp válido com DDD.",

                    "error"

                );


                return;


            }


            if (
                !consentimento
            ) {


                showMessage(

                    "Você precisa autorizar o uso dos dados para concluir o cadastro.",

                    "error"

                );


                return;


            }



            /* =========================================
               BOTÃO CARREGANDO
            ========================================== */

            const originalButtonHTML =
                submitButton.innerHTML;


            submitButton.disabled =
                true;


            submitButton.innerHTML =
                `

                    <span>
                        REALIZANDO CADASTRO...
                    </span>

                `;



            try {


                /* =====================================
                   OBJETO DO LEAD
                ====================================== */

                const leadData = {


                    nome:
                        nome,


                    email:
                        email,


                    whatsapp:
                        normalizePhone(
                            whatsappFormatted
                        ),


                    consentimento:
                        true,


                    utm_source:
                        getUTM(
                            "utm_source"
                        ),


                    utm_medium:
                        getUTM(
                            "utm_medium"
                        ),


                    utm_campaign:
                        getUTM(
                            "utm_campaign"
                        ),


                    utm_content:
                        getUTM(
                            "utm_content"
                        ),


                    utm_term:
                        getUTM(
                            "utm_term"
                        ),


                    referrer:
                        document.referrer
                        ||
                        null,


                    landing_url:
                        window.location.href


                };



                /* =====================================
                   INSERT NO SUPABASE
                ====================================== */

                const {
                    error
                } =

                    await supabaseClient

                        .from(
                            "leads_formula_trader_pro"
                        )

                        .insert([
                            leadData
                        ]);



                /* =====================================
                   ERRO SUPABASE
                ====================================== */

                if (error) {


                    console.error(

                        "Erro Supabase:",

                        error

                    );


                    throw error;


                }



                /* =====================================
   SUCESSO
====================================== */


/*
    Dispara o evento Lead no Meta
    somente depois que o Supabase
    confirmou o cadastro.
*/

if (
    typeof window.fbq
    ===
    "function"
) {

    window.fbq(

        "track",

        "Lead"

    );

}



/*
    Aguarda alguns milissegundos
    para permitir o envio do evento
    e então direciona para
    a página de obrigada.
*/

setTimeout(
    () => {

        window.location.href =
            "./obrigado.html";

    },

    300

);


                /* =====================================
                   META PIXEL

                   Se o Meta Pixel estiver instalado,
                   registra automaticamente o Lead.
                ====================================== */

                if (
                    typeof window.fbq
                    ===
                    "function"
                ) {


                    window.fbq(

                        "track",

                        "Lead"

                    );


                }



                /* =====================================
                   LIMPA FORMULÁRIO
                ====================================== */

                form.reset();



                /* =====================================
                   OPCIONAL

                   Se quiser enviar a pessoa para
                   página de obrigado posteriormente,
                   use:

                   window.location.href =
                   "./obrigado.html";
                ====================================== */


            }


            catch (error) {


                console.error(

                    "Erro ao cadastrar lead:",

                    error

                );


                showMessage(

                    "Não foi possível concluir seu cadastro. Tente novamente em alguns instantes.",

                    "error"

                );


            }


            finally {


                submitButton.disabled =
                    false;


                submitButton.innerHTML =
                    originalButtonHTML;


            }


        }

    );


}



/* =========================================================
   CTA FIXO NO MOBILE
========================================================= */

function handleMobileCTA() {


    if (!mobileCTA) {
        return;
    }


    if (

        window.innerWidth <= 760

        &&

        window.scrollY > 450

    ) {


        mobileCTA.classList.add(
            "visible"
        );


    }


    else {


        mobileCTA.classList.remove(
            "visible"
        );


    }


}



window.addEventListener(

    "scroll",

    handleMobileCTA,

    {
        passive: true
    }

);


window.addEventListener(

    "resize",

    handleMobileCTA

);


handleMobileCTA();



/* =========================================================
   SCROLL SUAVE
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        link => {


            link.addEventListener(

                "click",

                event => {


                    const targetID =
                        link.getAttribute(
                            "href"
                        );


                    if (

                        !targetID

                        ||

                        targetID === "#"

                    ) {


                        return;


                    }


                    const target =
                        document.querySelector(
                            targetID
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "center"

                    });


                }

            );


        }
    );
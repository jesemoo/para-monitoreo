// Credenciales de conexión a Supabase
const SUPABASE_URL = "https://aqhdycxdmwtcvakeatzo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jzR5ifkJctgDaFcQinYPow_-9VcUsUF";

// Inicializar el cliente global de Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentStep = 1;
const totalSteps = 4;

// Actualiza el porcentaje visual de la barra superior
function updateProgressBar() {
    const percentage = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${percentage}%`;
}

// Avanzar de pantalla
function nextStep(step) {
    if (step === 2 && !document.getElementById('nombre_usuario').value.trim()) {
        alert('Por favor, dinos tu nombre o un alias.');
        return;
    }
    
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    updateProgressBar();
}

// Retroceder de pantalla
function prevStep(step) {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    updateProgressBar();
}

// Actualizar en tiempo real el indicador numérico del slider (1 al 10)
function updateRangeValue(val) {
    document.getElementById('rangeValue').innerText = val;
}

// Capturar el evento de envío del formulario
document.getElementById('surveyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = "Guardando...";

    // Obtener los valores ingresados por el usuario
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const dia_registro = parseInt(document.getElementById('dia_registro').value);
    const tipo_monitoreo = document.querySelector('input[name="tipo_monitoreo"]:checked').value;
    const comodidad_termica = parseInt(document.getElementById('comodidad_termica').value);
    const observacion = document.getElementById('observacion').value;

    try {
        // Insertar registro en la tabla de Supabase
        const { data, error } = await supabase
            .from('encuestas_ecoalerta')
            .insert([
                { nombre_usuario, dia_registro, tipo_monitoreo, comodidad_termica, observacion }
            ]);

        if (error) throw error;

        // Si todo sale bien, mostrar pantalla final de agradecimiento
        document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
        document.getElementById('stepSuccess').classList.add('active');
        document.getElementById('progressBar').style.width = '100%';

    } catch (error) {
        alert('Hubo un error al enviar tus datos: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Enviar reporte";
    }
});

// Reiniciar el formulario para una nueva encuesta
function resetSurvey() {
    document.getElementById('surveyForm').reset();
    document.getElementById('rangeValue').innerText = "7";
    nextStep(1);
}
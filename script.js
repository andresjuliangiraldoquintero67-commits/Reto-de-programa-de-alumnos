const nombres = []; // Arreglo unidimensional para guardar los nombres
const notas = [];   // Matriz (arreglo de arreglos) para guardar las notas [[c1, c2, c3], ...]
const MAX_ALUMNOS = 10;
const form = document.getElementById("studentForm");

form.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    // 1. Validar si ya llegamos al límite de 10 alumnos
    if (nombres.length >= MAX_ALUMNOS) {
        alert("Ya se ha alcanzado el límite máximo de 10 alumnos.");
        return;
    }

    // 2. Capturar los valores de los inputs
    const nombreInput = document.getElementById("nombre").value.trim();
    const c1Str = document.getElementById("c1").value;
    const c2Str = document.getElementById("c2").value;
    const c3Str = document.getElementById("c3").value;

    // 3. Verificación estricta de nombre válido (solo letras, espacios y tildes, sin números ni símbolos)
    const esNombreValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreInput);
    if (nombreInput === "" || !esNombreValido) {
        alert("Error: El nombre no puede estar vacío, contener números ni símbolos extraños.");
        return;
    }

    // 4. Convertir texto a número y verificar que sean valores numéricos válidos (evita letras forzadas)
    const c1 = parseFloat(c1Str);
    const c2 = parseFloat(c2Str);
    const c3 = parseFloat(c3Str);

    if (isNaN(c1) || isNaN(c2) || isNaN(c3)) {
        alert("Error: Las notas de los certámenes deben ser estrictamente valores numéricos.");
        return;
    }

    // 5. Verificación de notas válidas dentro del rango lógico (0 a 100)
    if (c1 < 0 || c1 > 100 || c2 < 0 || c2 > 100 || c3 < 0 || c3 > 100) {
        alert("Error: Las notas de los certámenes deben estar obligatoriamente en un rango de 0 a 100.");
        return;
    }

    // 6. Guardar en los arreglos globales si pasa todas las validaciones
    nombres.push(nombreInput);
    notas.push([c1, c2, c3]);

    // 7. Actualizar el texto del contador en pantalla (Ej: "Alumnos ingresados: 2 / 10")
    document.getElementById("contadorAlumnos").textContent = `Alumnos ingresados: ${nombres.length} / ${MAX_ALUMNOS}`;

    // 8. LLAMAR A LA FUNCIÓN PRINCIPAL QUE DIBUJA Y CALCULA TODO
    actualizarInterfaz();

    // 9. Limpiar los campos del formulario para el siguiente alumno
    form.reset();
});

function actualizarInterfaz() {
    const contenedorEstudiantes = document.getElementById("resultadosEstudiantes");
    const resumenCursoBox = document.getElementById("resumenCurso");
    const contenidoResumen = document.getElementById("contenidoResumen");

    // Limpiamos el contenedor para volver a dibujarlo actualizado sin duplicados
    contenedorEstudiantes.innerHTML = "";

    // Variables para los cálculos globales del curso
    let sumaC1 = 0;
    let sumaC2 = 0;
    let sumaC3 = 0;
    let aprobados = 0;
    let reprobados = 0;
    let sumaPromediosFinales = 0;

    // Bucle para recorrer a todos los alumnos ingresados hasta el momento (desde el 1ro)
    for (let i = 0; i < nombres.length; i++) {
        const nombreAlumno = nombres[i];
        const notaC1 = notas[i][0];
        const notaC2 = notas[i][1];
        const notaC3 = notas[i][2];

        // Calcular el promedio individual de este alumno
        const promedioAlumno = (notaC1 + notaC2 + notaC3) / 3;

        // Acumular para los promedios del curso
        sumaC1 += notaC1;
        sumaC2 += notaC2;
        sumaC3 += notaC3;
        sumaPromediosFinales += promedioAlumno;

        // Contar aprobados y reprobados (Nota >= 55 es aprobado según tu regla)
        if (promedioAlumno >= 55) {
            aprobados++;
        } else {
            reprobados++;
        }

        // Crear dinámicamente la tarjeta (el cuadro) para este alumno
        const tarjeta = document.createElement("div");
        tarjeta.className = "student-card";
        tarjeta.innerHTML = `
            <h3>Nombre ${i + 1}: ${nombreAlumno}</h3>
            <p>C1: ${notaC1}</p>
            <p>C2: ${notaC2}</p>
            <p>C3: ${notaC3}</p>
            <p><strong>Promedio: ${promedioAlumno.toFixed(2)}</strong></p>
        `;
        contenedorEstudiantes.appendChild(tarjeta);
    }

    // Calcular los promedios generales del curso usando la cantidad actual de alumnos (nombres.length)
    const cantidadTotal = nombres.length;
    const promedioCursoC1 = sumaC1 / cantidadTotal;
    const promedioCursoC2 = sumaC2 / cantidadTotal;
    const promedioCursoC3 = sumaC3 / cantidadTotal;
    const promedioFinalCurso = sumaPromediosFinales / cantidadTotal;

    // Hacer visible el cuadro de resumen general desde el primer alumno
    resumenCursoBox.style.display = "block";

    // Mostrar el contenido del resumen actualizado al final de todo
    contenidoResumen.innerHTML = `
        <p>Promedio del curso C1: ${promedioCursoC1.toFixed(2)}</p>
        <p>Promedio del curso C2: ${promedioCursoC2.toFixed(2)}</p>
        <p>Promedio del curso C3: ${promedioCursoC3.toFixed(2)}</p>
        <p>Promedio Final Curso: ${promedioFinalCurso.toFixed(2)}</p>
        <p><strong>Aprobados: ${aprobados}</strong></p>
        <p><strong>Reprobados: ${reprobados}</strong></p>
    `;
}
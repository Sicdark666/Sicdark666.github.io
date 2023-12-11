document.addEventListener('DOMContentLoaded', function () {
    // Cargar los datos del CSV
    fetch('datos.csv')
        .then(response => response.text())
        .then(data => {
            // Parsear el CSV
            const filas = data.split('\n');
            const headers = filas[0].split(',');

            // Obtener los elementos select
            const departamentoSelect = document.getElementById('departamentoSelect');
            const odnSelect = document.getElementById('odnSelect');

            // Llenar los elementos select con opciones únicas de las columnas correspondientes
            llenarSelect(headers[0], departamentoSelect);
            llenarSelect(headers[1], odnSelect);

            // Agregar un evento para filtrar la tabla cuando cambie la selección
            departamentoSelect.addEventListener('change', filtrarTabla);
            odnSelect.addEventListener('change', filtrarTabla);
        })
        .catch(error => console.error('Error al cargar los datos:', error));
});

function llenarSelect(columna, selectElement) {
    const valoresUnicos = obtenerValoresUnicos(columna);

    // Agregar opción por defecto
    const opcionDefecto = document.createElement('option');
    opcionDefecto.text = 'Todos';
    selectElement.add(opcionDefecto);

    // Llenar el select con valores únicos
    valoresUnicos.forEach(valor => {
        const opcion = document.createElement('option');
        opcion.text = valor;
        selectElement.add(opcion);
    });
}

function obtenerValoresUnicos(columna) {
    // Eliminar encabezado y espacios en blanco
    const valores = columna.split(',').slice(1).map(valor => valor.trim());

    // Filtrar valores únicos
    const valoresUnicos = [...new Set(valores)];

    return valoresUnicos;
}

function filtrarTabla() {
    const departamentoSelect = document.getElementById('departamentoSelect');
    const odnSelect = document.getElementById('odnSelect');

    const departamentoSeleccionado = departamentoSelect.value;
    const odnSeleccionado = odnSelect.value;

    fetch('datos.csv')
        .then(response => response.text())
        .then(data => {
            const filas = data.split('\n');
            const headers = filas[0].split(',');

            // Filtrar las filas según las selecciones
            const filasFiltradas = filas.filter(fila => {
                const valores = fila.split(',');
                const departamento = valores[headers.indexOf('Departamento')];
                const odn = valores[headers.indexOf('Nombre de ODN/ODN Name')];

                return (departamentoSeleccionado === 'Todos' || departamento === departamentoSeleccionado) &&
                       (odnSeleccionado === 'Todos' || odn === odnSeleccionado);
            });

            // Crear el contenido de la tabla
            const contenidoTabla = filasFiltradas.join('\n');

            // Actual

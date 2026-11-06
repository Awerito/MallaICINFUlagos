# juaramir.github.io

En la línea 1221 aproximadamente modificar "const DATA_ICINF" para cambiar los datos de los cursos, la estructura es la misma del archivo "data_ICINF.json"

La estructura de DATA_ICINF es Semestre:
[Nombre, Código, HD, HTA, SCT, Competencia, Prerrequisitos, Semestre]

[Nombre Asignatura, Codigo, Horas Docencia Directa, Horas Trabajo Autónomo, SCT, Competencia a la que está asociada, ["Previaturas"], Semestre en que se imparte]

["Previaturas"] puede quedar como [] para cuando no posee previaturas, pueden ser separadas con comas cuando es más de una

Semestre en que se imparte puede ser A: Ambos, I: Impar, P: Par.

Competencia: es una sigla según lo indicado en "const COLORS_ICINF"

En la línea Siguiente "const COLORS_ICINF" se pueden modificar las competencias y colores, la misma estructura del archivo "colors_ICINF.json"

MAX_SCT_SEMESTER = 33; Es la cantidad máxima de SCT por semestre para establecer una advertencia.

const LICENCIATURA_CONFIG se establecen los prerequisitos de la licenciatura.

Selector de semestre a cursar (Impar I / Par P / Todos): Incorpora en la franja superior un planificador de inscripción donde el estudiante elige si cursará un Semestre Impar (I + A) o Semestre Par (P + A), mostrando habilitadas (opacidad 100%) únicamente las asignaturas cuyos prerrequisitos están aprobados y que efectivamente se dictan en ese período, mientras que las que corresponden al semestre opuesto quedan atenuadas con una etiqueta indicativa (Solo Sem. Par (P) o Solo Sem. Impar (I)).

Si deseas fijar de forma permanente un número menor de cursos del Semestre 8 para la Licenciatura dentro del código fuente, solo debes cambiar la propiedad minApprovedCount: 6 en el objeto LICENCIATURA_CONFIG al inicio de la etiqueta <script>

const CONVALIDACION_MALLA_2027: Incorpora en la sección <script> la constante con los 56 registros de equivalencia entre "malla nueva" (S11 a S103) y sus respectivos arreglos "DU416", lista para editarse directamente en el código a futuro.

Carga y convalidación de archivo del estudiante (Aprobados_du416.json): Añade en el encabezado el botón Convalidar DU416 (.json) (además de detección automática en ⬆ Cargar Respaldo), el cual lee el listado "DU416" del archivo JSON del estudiante, cruza los códigos con CONVALIDACION_MALLA_2027, tarja como aprobadas las asignaturas convalidadas con la insignia ✓ CONVALIDADA (...), desbloquea las asignaturas que abren y despliega un aviso resumen con el total de ramos y créditos SCT convalidados.

Referencia visual DU416 en cada casilla: Muestra en el pie de cada tarjeta y en su descripción emergente el código DU416 equivalente de la asignatura.


NOTA:
Los archivos json no son utilizados, solo son referenciales de la estructura.

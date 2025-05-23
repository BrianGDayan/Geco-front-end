export default function FormularioPlanilla() {
    return (
      <div className="mt-9 ">
        <h1 className="text-xl font-semibold">Ingrese los datos de la planilla</h1>
        <form className="flex flex-col" action="" method="post">
          <div className="flex flex-col mt-5">
            <label htmlFor="nroPlanilla" className="text-lg">Número de planilla</label>
            <input type="text" id="nroPlanilla" name="nroPlanilla" className="border border-gray-border text-gray-text rounded p-2 mt-1" maxLength={15} required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="obra" className="text-lg">Obra</label>
            <input type="text" id="obra" name="obra" className="border border-gray-border rounded p-2 mt-1" maxLength={30} required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="nroPlano" className="text-lg">Número de plano</label>
            <input type="text" id="nroPlano" name="nroPlano" className="border border-gray-border rounded p-2 mt-1" maxLength={30} required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="sector" className="text-lg">Sector</label>
            <input type="text" id="sector" name="sector" className="border border-gray-border rounded p-2 mt-1" maxLength={30} required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="encargadoElaborar" className="text-lg">Encargado de elaborar</label>
            <input type="text" id="encargadoElaborar" name="encargadoElaborar" className="border border-gray-border rounded p-2 mt-1" maxLength={15} required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="encargadoRevisar" className="text-lg">Encargado de revisar</label>
            <input type="text" id="encargadoRevisar" name="encargadoRevisar" className="border border-gray-border rounded p-2 mt-1" maxLength={15} required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="encargadoAprobar" className="text-lg">Encargado de aprobar</label>
            <input type="text" id="encargadoAprobar" name="encargadoAprobar" className="border border-gray-border rounded p-2 mt-1" maxLength={15} />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="fecha" className="text-lg">Fecha</label>
            <input type="date" id="fecha" name="fecha" className="border border-gray-border rounded p-2 mt-1" required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="item" className="text-lg">Item</label>
            <input type="text" id="item" name="item" className="border border-gray-border rounded p-2 mt-1" maxLength={20} required />
          </div>
          <button className="flex justify-center mt-5 text-xl bg-primary hover:bg-primary-dark text-white p-3 rounded-md" >Ingresar</button>
        </form>
    </div>
    );
  }
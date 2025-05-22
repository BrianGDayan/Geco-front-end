export default function FormularioPlanilla() {
    return (
      <div className="mt-9 ">
        <h1 className="text-xl font-semibold">Ingrese los datos de la planilla</h1>
        <form className="flex flex-col" action="" method="post">
          <div className="flex flex-col mt-5">
            <label htmlFor="nroPlanilla" className="text-lg">Número de planilla</label>
            <input type="text" id="nroPlanilla" name="nroPlanilla" className="border border-gray-border text-gray-text rounded p-2 mt-1" required />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="password" className="text-lg">Contraseña</label>
            <input type="password" id="password" name="password" className="border border-gray-border rounded p-2 mt-1" required />
          </div>
          <button className="flex justify-center mt-5 text-xl bg-primary hover:bg-primary-dark text-white p-3 rounded-md" >Ingresar</button>
        </form>
    </div>
    );
  }
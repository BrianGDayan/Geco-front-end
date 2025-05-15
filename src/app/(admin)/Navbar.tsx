import { NavbarLink } from "./NavbarLink";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function Navbar() {
  return(
    <nav className="bg-primary-mid border-t border-primary-dark/40 text-white shadow-md h-14 flex items-center px-4">
      <div className="w-full flex justify-center">
        <ul className="flex space-x-4 h-full">
          <li className="h-full flex items-center"><NavbarLink href="/home"> Inicio </NavbarLink></li>
          <li className="h-full flex items-center"><NavbarLink href="/crear-planilla"> Crear planilla </NavbarLink></li>
          <li className="h-full flex items-center relative">
            <Menu as="div" className="relative">
              <MenuButton className="px-4 py-2 rounded-md transition-colors duration-200 hover:bg-primary-dark">Listado de planillas</MenuButton>
              <MenuItems className="absolute mt-2 w-56 rounded-md shadow-lg bg-primary-dark ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="p-2">
                  <MenuItem>
                    <NavbarLink href="/planillas-completadas" isDropdown>Completadas</NavbarLink>
                  </MenuItem>
                  <MenuItem>
                    <NavbarLink href="/planillas-en-curso" isDropdown>En curso</NavbarLink>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </li>
        </ul>
      </div>
    </nav>
  )
}
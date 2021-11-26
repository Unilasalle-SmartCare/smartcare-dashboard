export const routes = [
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Dashboard']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Relatórios',
    to: '/dashboard/report',
    // icon: " ",
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Monitoramento',
    to: '/dashboard/monitoring',
    // icon: " ",
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Configurações']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Planta baixa',
    to: '/dashboard/floor_plan',
    // icon: " ",
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Sensores',
    to: '/dashboard/sensor',
    // icon: " ",
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Atuadores',
    to: '/dashboard/actuator',
    // icon: " ",
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Paciente',
    to: '/dashboard/patient',
    // icon: " ",
  }
]
export async function getAgents() {
    const availableAgents = [
  { id: '1', name: 'Ahmed Hassan' },
  { id: '2', name: 'Fatima Zahra' },
  { id: '3', name: 'Mohamed Ali' },
  { id: '4', name: 'Aziz Karim' },
]
return availableAgents;
}

export async function getRoles ()
{
  const availableRoles = [
     { id: '1', name: 'Chef' },
     { id: '2', name: 'Assistant' }
  ]
  return availableRoles;
}
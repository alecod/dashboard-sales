export const getInitials = (fullName: string): string => {
  const names = fullName.split(' ')
  let initials = names[0]?.charAt(0) || ''
  if (names.length > 1) {
    const lastName = names[names.length - 1]
    initials += lastName ? lastName.charAt(0) : ''
  }
  return initials.toUpperCase()
}

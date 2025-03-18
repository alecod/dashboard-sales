export const getGreeting = () => {
	const now = new Date()
	const hours = now.getHours()

	if (hours >= 5 && hours < 12) {
		return 'Bom dia'
	}
	if (hours >= 12 && hours < 18) {
		return 'Boa tarde'
	}
	return 'Boa noite'
}

const { render, screen } = require('@testing-library/react');
const HelloWorld = require('../../../components/HelloWorld');

test('renders HelloWorld component', () => {
	render(<HelloWorld />);
	const linkElement = screen.getByText(/hello world/i);
	expect(linkElement).toBeInTheDocument();
});
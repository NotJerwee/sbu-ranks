export default function Footer() {
	return (
		<footer className="mt-12 py-6 border-t border-gray-200 text-center text-sm text-gray-500">
			<p>
				© {new Date().getFullYear()} SBU Ranks. All rights reserved.
			</p>
		</footer>
	);
}
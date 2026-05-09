import { MdStore, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';

export const ContactPage = () => {
	return (
		<main className="Main">
			<div className="Main--content ContactPage">
				<section className="ContactPage__hero">
					<h1 className="ContactPage__hero-title">Sobre Aura Belleza</h1>
					<p className="ContactPage__hero-subtitle">Belleza que inspira, calidad que perdura</p>
				</section>

				<section className="ContactPage__about">
					<div className="ContactPage__about-content">
						<h2 className="ContactPage__section-title">Nuestra Historia</h2>
						<p className="ContactPage__text">
							<strong>Aura Belleza</strong> es un emprendimiento colombiano dedicado a potenciar tu belleza y autoestima. 
							Nacimos con la visión de ofrecer productos de alta calidad a precios accesibles, 
							demostrando que cuidarte no tiene que ser complicado ni costoso.
						</p>
						<p className="ContactPage__text">
							Desde nuestros inicios, nos hemos comprometido con la satisfacción de cada uno de nuestros 
							clientes, seleccionando cuidadosamente cada producto para garantizar que cumpla con 
							nuestros estándares de excelencia. Creemos firmemente que todos merecen sentirse bien 
							con sí mismos.
						</p>
					</div>
				</section>

				<section className="ContactPage__values">
					<h2 className="ContactPage__section-title">Nuestros Valores</h2>
					<div className="ContactPage__values-grid">
						<div className="ContactPage__value">
							<span className="ContactPage__value-title">Calidad</span>
							<p className="ContactPage__value-text">Solo trabajamos con productos que cumplen nuestros estrictos estándares de calidad.</p>
						</div>
						<div className="ContactPage__value">
							<span className="ContactPage__value-title">Honestidad</span>
							<p className="ContactPage__value-text">Precios claros y transparentes, sin sorpresas ni costos ocultos.</p>
						</div>
						<div className="ContactPage__value">
							<span className="ContactPage__value-title">Accesibilidad</span>
							<p className="ContactPage__value-text">Belleza para todos, con precios diseñados para cada presupuesto.</p>
						</div>
						<div className="ContactPage__value">
							<span className="ContactPage__value-title">Atención Personal</span>
							<p className="ContactPage__value-text">Te acompañamos en cada paso, resolviendo tus dudas y escuchando tus necesidades.</p>
						</div>
					</div>
				</section>

				<section className="ContactPage__info">
					<h2 className="ContactPage__section-title">Encuéntranos</h2>
					<div className="ContactPage__info-grid">
						<div className="ContactPage__info-details">
							<div className="ContactPage__info-item">
								<MdStore className="ContactPage__info-icon" />
								<div>
									<span className="ContactPage__info-label">Tienda</span>
									<p className="ContactPage__info-text">Aura Belleza Store</p>
								</div>
							</div>
							<div className="ContactPage__info-item">
								<MdPhone className="ContactPage__info-icon" />
								<div>
									<span className="ContactPage__info-label">WhatsApp</span>
									<p className="ContactPage__info-text">Escríbenos para consultas y pedidos</p>
								</div>
							</div>
							<div className="ContactPage__info-item">
								<MdEmail className="ContactPage__info-icon" />
								<div>
									<span className="ContactPage__info-label">Correo electrónico</span>
									<p className="ContactPage__info-text">contacto@aurabelleza.com</p>
								</div>
							</div>
							<div className="ContactPage__info-item">
								<MdLocationOn className="ContactPage__info-icon" />
								<div>
									<span className="ContactPage__info-label">Dirección</span>
									<p className="ContactPage__info-text">Colombia</p>
								</div>
							</div>
						</div>
						<div className="ContactPage__map">
							<iframe
								title="Ubicación Aura Belleza"
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1188.4527965845923!2d-74.20690701002826!3d4.581433522359823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f990a1a6e3d1d%3A0x671701ce77b96a39!2sAura.Belleza!5e0!3m2!1ses-419!2sco!4v1778300707818!5m2!1ses-419!2sco"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen=""
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};
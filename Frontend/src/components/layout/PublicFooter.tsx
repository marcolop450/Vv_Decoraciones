import { useConfiguracion } from '../../hooks/useConfiguracion'
import { VvOrnamentDivider } from '../ui/VvPrimitives'
import vvLogo from '../../assets/vv-logo.png'

export function PublicFooter() {
  const { config } = useConfiguracion()

  return (
    <footer className="bg-[#0E0E11] border-t border-[#D4AF37]/20 pt-12 pb-8 text-[#C4B9A5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Lema */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img src={vvLogo} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="font-['Cormorant_Garamond'] text-xl font-bold text-[#F9F6F0]">
                {config.businessName}
              </span>
            </div>
            <p className="text-xs text-[#7D7568] max-w-sm leading-relaxed">
              {config.brandSubtitle}. Ambientaciones de lujo para crear recuerdos imborrables.
            </p>
          </div>

          {/* Contacto Directo Parametrizado */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Contacto Directo
            </h4>
            <p className="text-sm text-[#F9F6F0]">WhatsApp: {config.whatsappPhone}</p>
            <p className="text-sm text-[#F9F6F0]">Llamadas: {config.contactPhone}</p>
            <p className="text-xs text-[#7D7568]">{config.locationAddress}</p>
          </div>

          {/* Enlaces Sociales */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Redes Sociales
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href={config.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-[#F3D37A]">
                  Instagram Oficial
                </a>
              </li>
              <li>
                <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-[#F3D37A]">
                  Facebook
                </a>
              </li>
              <li>
                <a href={config.tiktokUrl} target="_blank" rel="noreferrer" className="hover:text-[#F3D37A]">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <VvOrnamentDivider />

        <div className="text-center text-xs text-[#7D7568]">
          (c) {new Date().getFullYear()} {config.businessName} — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

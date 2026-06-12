import { useState } from "react";
import { MapPin, Plus, X, Ban, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCompact } from "@/lib/mock-data";
import { geoKindMeta, INTEREST_POOL, type GeoKind, type GeoTarget, type Demographics } from "@/lib/manage-data";

/** Editor de geolocalização — países/regiões/cidades/raio, incluir ou excluir. */
export function GeoTargeting({
  geos,
  onAdd,
  onRemove,
  onToggle,
}: {
  geos: GeoTarget[];
  onAdd: (kind: GeoKind, name: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const [kind, setKind] = useState<GeoKind>("city");
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return;
    onAdd(kind, name);
    setName("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={kind} onValueChange={(v) => setKind(v as GeoKind)}>
          <SelectTrigger className="w-36 h-9 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(geoKindMeta) as GeoKind[]).map((k) => (
              <SelectItem key={k} value={k}>{geoKindMeta[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={kind === "radius" ? "Ex.: 10 km de São Paulo" : "Ex.: São Paulo"}
          className="h-9 flex-1 min-w-[180px] bg-white"
        />
        <Button onClick={add} className="h-9 gap-1.5">
          <Plus className="size-4" /> Adicionar
        </Button>
      </div>

      {geos.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma localização — o anúncio veicula em todas as regiões disponíveis.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {geos.map((g) => (
            <div
              key={g.id}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border pl-2.5 pr-1.5 py-1.5 text-xs",
                g.excluded ? "border-rose-200 bg-rose-50 text-rose-700" : "border-border bg-white",
              )}
            >
              <MapPin className="size-3.5 shrink-0 opacity-70" />
              <div className="leading-tight">
                <span className="font-medium">{g.name}</span>
                <span className="text-muted-foreground"> · {geoKindMeta[g.kind]}{g.reach ? ` · ${formatCompact(g.reach)} alcance` : ""}</span>
              </div>
              <button
                onClick={() => onToggle(g.id)}
                title={g.excluded ? "Incluir" : "Excluir"}
                className="size-6 rounded flex items-center justify-center hover:bg-black/5"
              >
                {g.excluded ? <Check className="size-3.5" /> : <Ban className="size-3.5" />}
              </button>
              <button onClick={() => onRemove(g.id)} title="Remover" className="size-6 rounded flex items-center justify-center hover:bg-rose-100 hover:text-rose-600">
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const GENDERS: { v: "male" | "female"; label: string }[] = [
  { v: "male", label: "Masculino" },
  { v: "female", label: "Feminino" },
];
const DEVICES: { v: "MOBILE" | "DESKTOP" | "TABLET"; label: string }[] = [
  { v: "MOBILE", label: "Celular" },
  { v: "DESKTOP", label: "Desktop" },
  { v: "TABLET", label: "Tablet" },
];

/** Editor de demografia/dispositivos (segmentação avançada — Meta). */
export function DemographicsEditor({ demo, onChange }: { demo: Demographics; onChange: (d: Demographics) => void }) {
  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Idade</p>
        <div className="flex items-center gap-2">
          <Input
            type="number" min={13} max={65} value={demo.ageMin}
            onChange={(e) => onChange({ ...demo, ageMin: Math.min(Number(e.target.value), demo.ageMax) })}
            className="h-8 w-16"
          />
          <span className="text-xs text-muted-foreground">até</span>
          <Input
            type="number" min={13} max={65} value={demo.ageMax}
            onChange={(e) => onChange({ ...demo, ageMax: Math.max(Number(e.target.value), demo.ageMin) })}
            className="h-8 w-16"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Gênero {demo.genders.length === 0 && <span className="opacity-60">(todos)</span>}</p>
        <div className="flex gap-1.5">
          {GENDERS.map((g) => (
            <Chip key={g.v} active={demo.genders.includes(g.v)} onClick={() => onChange({ ...demo, genders: toggle(demo.genders, g.v) })}>
              {g.label}
            </Chip>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Dispositivos {demo.devices.length === 0 && <span className="opacity-60">(todos)</span>}</p>
        <div className="flex flex-wrap gap-1.5">
          {DEVICES.map((d) => (
            <Chip key={d.v} active={demo.devices.includes(d.v)} onClick={() => onChange({ ...demo, devices: toggle(demo.devices, d.v) })}>
              {d.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Editor de interesses (chips) — Meta. */
export function InterestEditor({ interests, onAdd, onRemove }: { interests: string[]; onAdd: (i: string) => void; onRemove: (i: string) => void }) {
  const [value, setValue] = useState("");
  const suggestions = INTEREST_POOL.filter((i) => !interests.includes(i)).slice(0, 6);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {interests.length === 0 && <span className="text-xs text-muted-foreground">Nenhum interesse selecionado.</span>}
        {interests.map((i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-cyan/10 text-cyan border border-cyan/30 px-2 py-1 text-xs">
            {i}
            <button onClick={() => onRemove(i)} className="hover:text-rose-600"><X className="size-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) { onAdd(value.trim()); setValue(""); } }}
          placeholder="Adicionar interesse..."
          className="h-8 flex-1 bg-white"
        />
        <Button size="sm" className="h-8" onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(""); } }}>
          <Plus className="size-4" />
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} onClick={() => onAdd(s)} className="text-[11px] rounded-md border border-dashed border-border px-2 py-0.5 text-muted-foreground hover:border-cyan hover:text-cyan">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        active ? "border-violet bg-violet/10 text-violet" : "border-border text-muted-foreground hover:border-foreground/30",
      )}
    >
      {children}
    </button>
  );
}

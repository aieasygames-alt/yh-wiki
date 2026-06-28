import Link from "next/link";

export function ADFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/en/anime-destiny/codes" className="hover:text-purple-400">Codes</Link></li>
              <li><Link href="/en/anime-destiny/tier-list" className="hover:text-purple-400">Tier List</Link></li>
              <li><Link href="/en/anime-destiny/units" className="hover:text-purple-400">Units</Link></li>
              <li><Link href="/en/anime-destiny/traits" className="hover:text-purple-400">Traits</Link></li>
              <li><Link href="/en/anime-destiny/artifacts" className="hover:text-purple-400">Artifacts</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white"><Link href="/en/anime-destiny/guides" className="hover:text-purple-400">Guides</Link></h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/en/anime-destiny/guides/beginner-guide" className="hover:text-purple-400">Beginner Guide</Link></li>
              <li><Link href="/en/anime-destiny/guides/summon-gems-guide" className="hover:text-purple-400">Summon &amp; Gems</Link></li>
              <li><Link href="/en/anime-destiny/guides/summon-rates-guide" className="hover:text-purple-400">Summon Rates</Link></li>
              <li><Link href="/en/anime-destiny/guides/evolution-materials-guide" className="hover:text-purple-400">Evolution Materials</Link></li>
              <li><Link href="/en/anime-destiny/guides/story-mode-guide" className="hover:text-purple-400">Story Mode</Link></li>
              <li><Link href="/en/anime-destiny/guides/boss-guide" className="hover:text-purple-400">Boss Guide</Link></li>
              <li><Link href="/en/anime-destiny/guides/endless-mode-guide" className="hover:text-purple-400">Endless Mode</Link></li>
              <li><Link href="/en/anime-destiny/guides/raid-mode-guide" className="hover:text-purple-400">Raid Mode</Link></li>
              <li><Link href="/en/anime-destiny/guides/team-composition-guide" className="hover:text-purple-400">Team Comps</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Community</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://discord.gg/animedestiny" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">Discord</a></li>
              <li><a href="https://www.roblox.com/games/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">Play on Roblox</a></li>
              <li><a href="https://www.roblox.com/groups/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">Roblox Group</a></li>
              <li><a href="https://trello.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">Trello</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">More</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/en" className="hover:text-purple-400">NTE Wiki (异环)</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
          <p>Anime Destiny Wiki — Unofficial fan-made resource. Not affiliated with the developers of Anime Destiny.</p>
          <p className="mt-1">&copy; 2026 nteguide.com</p>
        </div>
      </div>
    </footer>
  );
}

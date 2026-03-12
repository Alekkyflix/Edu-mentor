#!/bin/bash
# Script to ensure all page.tsx files use force-dynamic for Amplify/Next.js 14 SSR detection

echo "Checking for pages needing SSR/Dynamic rendering..."

# Find all page files in the app directory
pages=$(find app -name "page.tsx")

for page in $pages; do
  if ! grep -q "force-dynamic" "$page"; then
    echo "Adding force-dynamic to $page..."
    # Insert after 'use client' if it exists, otherwise at the top
    if grep -q "'use client'" "$page"; then
      sed -i "s/'use client';/'use client';\n\nexport const dynamic = 'force-dynamic';/" "$page"
    else
      sed -i "1s/^/export const dynamic = 'force-dynamic';\n\n/" "$page"
    fi
  else
    echo "[-] $page already has dynamic configuration."
  fi
done

echo "Done. All pages are now explicitly set to force-dynamic."
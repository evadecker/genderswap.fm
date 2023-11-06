import { supabase } from '$lib/supabase';
import type { Tables } from '$lib/types/types';

type GridItem = {
	original: Tables<'songs'>;
	cover: Tables<'songs'>;
	slug: string;
};

const PAGE_SIZE = 60;

export async function load({ url }) {
	const page = Number(url.searchParams.get('page') ?? 1);
	const tags = url.searchParams.get('tags');

	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const covers = supabase
		.from('covers')
		.select(
			`
          slug,
          original:original_id(id, name, artists, album_name, album_img),
          cover:cover_id(id, name, artists, album_name, album_img)
        `,
			{ count: 'estimated' }
		)
		.order('created_at', { ascending: false })
		.range(from, to);

	if (tags) {
		covers.overlaps('tags', [tags]);
	}

	const { data, count } = await covers.returns<GridItem[]>();

	return {
		covers: data,
		totalCount: count,
		from,
		to,
		isFirst: page === 1,
		isLast: !data || data.length < PAGE_SIZE
	};
}
